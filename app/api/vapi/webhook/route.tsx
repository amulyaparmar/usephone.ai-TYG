import { client } from "@/utils/twilio/twilio";
import { NextResponse } from "next/server";
import axios from 'axios'
import {supabase} from '../../../../utils/supabase/supabase_usePhoneAi_db'
import {handleCallUpdates,fetchAndUploadAudio,deepgram_gen_transcript} from '../../../../utils/twilio/utils'
import { generateEvaluationFromAudio } from "../../twilio/geminiApi/route";

function formatAllVapiData(dataArray:any) {
    return dataArray.map((item:any) => {
      // Use optional chaining to handle missing properties gracefully
      const lastNewlineIndex = item.message?.lastIndexOf("\n") + 1;
      const formattedMessage = lastNewlineIndex > 0 ? item.message?.substring(lastNewlineIndex).trim() : item.message?.trim() || "";
  
      return {
        type: item.role,
        message: formattedMessage,
        time: item.secondsFromStart
      };
    });
  }
  
  

  
export async function POST(request:any) {
    try {
        const req_data = await request.json();

        // if its not a end of call report return early 
        if (req_data?.message?.type !== "end-of-call-report") {
            return new NextResponse(JSON.stringify({ success: false}), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        console.log("webhoook_data TYG",req_data)
        

        // retrieve recording url and callSid, transcript from Vapi AI webhook
        let {id, transcript,messages,recordingUrl, summary, call} = req_data?.message
        
        // downlaod audio url from Vapi and upload to supabase
        let file = recordingUrl
        let filename = "recordings/" + file.split("recordings/")[1] + ".wav"
        let path = await fetchAndUploadAudio(file,filename)
        recordingUrl ="https://uvydxjjrkynswzvgpggm.supabase.co/storage/v1/object/public/twilioCallsRecordings/" + path,
        

        // upsert initial call data to supabase
        handleCallUpdates({
            callId : call?.phoneCallProviderId || id,
            type : 'vapi-ai',
            transcript :  transcript,
            transcript_json: formatAllVapiData(messages),
            phone_number : call?.customer?.number,
            supabase_recording_url : recordingUrl,
            summary: summary,
            duration : call?.maxDurationSeconds
        })
        

         // Request the AI Evaluation via Gemini API TYG
        // let text = await generateEvaluationFromAudio(audio);
        let gemini_eval_res = await generateEvaluationFromAudio(recordingUrl);
        console.log('gemini_eval_res TYG: ', gemini_eval_res);
        handleCallUpdates({
            callId : call?.phoneCallProviderId,
            evaluations : gemini_eval_res 
        })

        

        return new NextResponse(JSON.stringify({ success: true}), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error:any) {
        console.error("Error fetching recordings:", error.message);

        // Send an error response back
        return new NextResponse(JSON.stringify({ success: false, message: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

