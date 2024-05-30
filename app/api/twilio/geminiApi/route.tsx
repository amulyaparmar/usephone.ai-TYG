import { NextResponse } from "next/server";

import axios from 'axios';

import FormData from 'form-data';

import { GoogleGenerativeAI } from "@google/generative-ai";

import fetch from 'node-fetch';

import mime from 'mime-types';
import { handleCallUpdates } from '@/utils/twilio/utils';



export const maxDuration = 250; // This function can run for a maximum of 5 seconds



const googleAI = new GoogleGenerativeAI("");




async function convertAudioToBase64(url:any) {

  try {

    const response = await fetch(url);

    const buffer = await response.buffer();

    const urlObject = new URL(url);
    urlObject.search = '';
    const cleanUrl = urlObject.toString();
    return {

      inlineData: {

        data: buffer.toString('base64'),

        mimeType: mime.lookup(cleanUrl),

      },

    };

  } catch (error) {

    console.error("Error fetching and converting audio: ", error);

    return null;

  }

}




const date = new Date();

const options = { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };

const estDateTime = new Intl.DateTimeFormat('en-US', options).format(date);




const formText = `

Date: ${estDateTime}  EST

Your Rubric goes here:



`;


const returnFormat = `
  Return answers to below in structured JSON List exclusively with the format: 
  [
    {
      keyword: overall_score_and_summary | weaknesses | strengths | suggestions for practice | full_rubric
      score: #1-100
      comments: ["",""] ...strings 
    }
    ...
  ]
`;

function parseJsonFromGemini(jsonStr) {
  try {
      // Remove potential leading/trailing whitespace
      jsonStr = jsonStr.trim();

      // Regular expression to extract JSON content from triple backticks and "json" language specifier
      const jsonRegex = /```json\s*(.*?)\s*```/s;
      const jsonMatch = jsonRegex.exec(jsonStr);

      if (jsonMatch) {
          jsonStr = jsonMatch[1];
      }

      // Parse the JSON string and return the resulting object
      return JSON.parse(jsonStr);
  } catch (error) {
      // Handle JSON parsing errors or any other errors by returning null
      return [];
  }
}

export async function generateEvaluationFromAudio(audio:any) {

  try {

    const model = googleAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    model.startChat({
      generationConfig: {
        responseMimeType : "application/json",
      },
    })
    const result = await model.generateContent([

      returnFormat + "What is happening in the audio? Also answer the following questions:" + formText,

      audio,

    ]);

    const response = await result.response;

    const text = await response.text();

    return  parseJsonFromGemini(text);

  } catch (error) {

    console.error("Error generating text from audio: ", error);

    return [];

  }

}


export async function generateEvaluationFromAudioTranscript(transcript:any) {

  try {

    const model = googleAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    model.startChat({
      generationConfig: {
        responseMimeType : "application/json",
      },
    })
    const result = await model.generateContent([

      returnFormat + `What is happening in the call? Use this Transcript : \n ${transcript} \n\n\n\n to answer the following questions:` + formText ,

    ]);

    const response = await result.response;

    const text = await response.text();

    return  parseJsonFromGemini(text);

  } catch (error) {

    console.error("Error generating text from audio: ", error);

    return [];

  }

}







export async function POST(request:any, response:any) {

    try {

        const body = await request.json();

        const audioUrl = body?.audioUrl;
        const audioTranscript = body?.audioTranscript;
        const callSid = body?.callSid;



        if (!audioUrl && !audioTranscript) {

            return new NextResponse(JSON.stringify({ success: false, message: "No audio URL provided" }), {

                status: 400,

                headers: {

                    'Content-Type': 'application/json',

                },

            });

        }




        let audio = await convertAudioToBase64(audioUrl);

        if (!audio && !audioTranscript) {

            return new NextResponse(JSON.stringify({ success: false, message: [], error: "Failed to convert audio" }), {

                status: 400,

                headers: {

                    'Content-Type': 'application/json',

                },

            });

        }

        let evalsJsonTYG = []

        if (audioTranscript) {
          evalsJsonTYG = await generateEvaluationFromAudioTranscript(audioTranscript);
          if (callSid) {
                handleCallUpdates({
                    callId: callSid,
                    evaluations: evalsJsonTYG
                });
           }
        }

        else if (audio) {
          evalsJsonTYG = await generateEvaluationFromAudio(audio);
          if (callSid) {
                handleCallUpdates({
                    callId: callSid,
                    evaluations: evalsJsonTYG
                });
           }
        }
        

       
        

        // Sending back the results from Deepgram

        return new NextResponse(JSON.stringify({ success: true, data: evalsJsonTYG }), {

            status: 200,

            headers: {

                'Content-Type': 'application/json',

            },

        });




    } catch (error:any) {

        console.error("Error: ", error.message);




        // Send an error response back

        return new NextResponse(JSON.stringify({ success: false, message: error.message }), {

            status: 500,

            headers: {

                'Content-Type': 'application/json',

            },

        });

    }

}