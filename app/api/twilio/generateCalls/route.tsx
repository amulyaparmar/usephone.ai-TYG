import { client, twilioConfig  } from "@/utils/twilio/twilio";
import { NextResponse } from "next/server";

import { twiml, jwt } from 'twilio';
const { VoiceResponse } = twiml;
const { AccessToken } = jwt;
const { VoiceGrant } = AccessToken;

var identity: string | any;

function voiceResponse(requestBody:any) {
  
};


function isAValidPhoneNumber(number : any) {
  return /^[\d\+\-\(\) ]+$/.test(number);
}

export async function POST(request:any, response:any) {
    try {
        // const { numbers } = request.body; // Assume an array of numbers to dial
        let form_data = await request.formData();
        console.log("twiml body TYG: ", form_data, typeof(form_data));

        return new NextResponse("", {
          status: 200,
          headers: {
              'Content-Type': 'application/xml',
          },
      });
        
        
        // const twiml = voiceResponse(form_data);
        response.statusCode = 200;
        return new NextResponse(twiml.toString(), {
            status: 200,
            headers: {
                'Content-Type': 'application/xml',
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

