import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'
import { generateEvaluationFromAudioTranscript } from "../geminiApi/route";

  

export const maxDuration = 250; // This function can run for a maximum of 5 seconds
export const revalidate = 0


const supabaseUrl = "";
const supabaseAnonKey = "";



export const OPTIONS = async (request: NextRequest) => {
    return new NextResponse('', {
      status: 200
    })
  }

function transformDeepgramParagraphsToUnifiedStructure(paragraphs:any) {
    return paragraphs?.map(paragraph => {
        // Concatenate all sentences into a single message
        const message = paragraph?.sentences.map(sentence => sentence?.text).join(' ');

        // Determine the type based on the speaker
        const type = paragraph.speaker === 0 ? 'bot' : 'user';

        return {
            type: type,
            message: message,
            time: paragraph.start
        };
    });
}

export async function POST(request:any, response:any) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey!);
    
    async function handleCallUpdates(obj : object) {
        console.log("handleCallUpdates",obj)
        const { data, error } = await supabase
        .from("calls")
        .upsert(obj)
        .select();
    }

    console.log('deepgramApi POST webhook called TYG: should work now TYG!');    
    
    
    try {

        

        const body = await request.json();
        const audioUrl = body?.audioUrl;
        const callSid = body?.callSid;
        const callGemini = body?.callGeminiOnTranscript;

        
        if (!audioUrl) {
            return new NextResponse(JSON.stringify({ success: false, message: "No audio URL provided" }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const deepgramApiKey = "";


        const deepgram_res = {}
        console.log('deepgramApi RECEIVED data TYG!');    

        
        if (callSid) {
            let transformed_transcript_json: any = []
            try {
                transformed_transcript_json = [];
            }
            catch (error) {
                console.error('Error in transforming:', error);
            }

            // upsert deepgram transcript to supabase

            handleCallUpdates({
                callId : callSid,
                transcript :  [],
                transcript_json :  transformed_transcript_json,
            })
            
        }

        
        if (callGemini) {
            let evalsJsonTYG = await generateEvaluationFromAudioTranscript(deepgram_res?.results?.channels?.[0]?.alternatives?.[0]?.paragraphs?.transcript);
            handleCallUpdates({
                callId : callSid,
                evaluations: evalsJsonTYG
            })
        }

        // Sending back the results from Deepgram
        return new NextResponse(JSON.stringify({ success: true, data: deepgram_res }), {
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