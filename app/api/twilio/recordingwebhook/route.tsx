import { client } from "@/utils/twilio/twilio";
import { NextResponse } from "next/server";
import axios from 'axios'
import {supabase} from '../../../../utils/supabase/supabase_usePhoneAi_db'
import {handleCallUpdates,fetchAndUploadAudio,deepgram_gen_transcript, transformDeepgramParagraphsToUnifiedStructure} from '@/utils/twilio/utils'
import { generateEvaluationFromAudio } from "../geminiApi/route";

export const maxDuration = 250; // This function can run for a maximum of 5 seconds
export const revalidate = 0

export async function POST(request:any) {
    try {
        const req_data = await request.formData();
        console.log("webhoook_data",req_data)


        return new NextResponse(JSON.stringify({ success: true,transcript_json :  ["transcript json goes here"]}), {
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

export async function GET(request:any) {
    try {
       console.log("GET TWILIO webhoook_data")
        return new NextResponse(JSON.stringify({ success: true}), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
    }
    catch (error:any) {
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
