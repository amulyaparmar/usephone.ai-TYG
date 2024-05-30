import { twilioConfig } from "@/utils/twilio/twilio";
import { NextResponse } from "next/server";

import { twiml, jwt } from 'twilio';
const { VoiceResponse } = twiml;
const { AccessToken } = jwt;
const { VoiceGrant } = AccessToken;


var identity: string | any;

function tokenGenerator(outgoingCallParams={
    "name": "BuildTogetherTYG",
    "callerId": "+17733096894",
}) {
  identity = "ScaleConvo2030TYG";

  const accessToken = new AccessToken(
    twilioConfig?.accountSid,
    twilioConfig?.apiKey,
    twilioConfig?.apiSecret,
    { ttl: 3600, identity: identity }
  );

  accessToken.identity = identity;
  const grant = new VoiceGrant({
    outgoingApplicationSid: twilioConfig?.twimlAppSid,
    incomingAllow: true,
    outgoingApplicationParams: {
        "name": "BuildTogetherTYG",
        "callerId": outgoingCallParams?.callerId,
    }
  });
  accessToken.addGrant(grant);

  // Include identity and token in a JSON response
  return {
    identity: identity,
    token: accessToken.toJwt(),
  };
};

export async function POST(request:any, response:any) {
    try {
        const body = await request.json(); // Assume an array of numbers to dial
        console.log("callerIdTYG body: ", body);

        // 16573857068
        // 17604630314
        const { fromCallerId = "+16573857068" } = body;
        const token = tokenGenerator({
            "name": "BuildTogetherTYG",
            "callerId": "+16573857068",
        });
        console.log("callerIdTYG: ", fromCallerId, request.body);
        response.statusCode = 200;
        return new NextResponse(JSON.stringify(token ), {
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


export async function GET(request:any, response:any) {
    try {
        // const { numbers } = request.body; // Assume an array of numbers to dial

 response.statusCode = 200;
        const token = tokenGenerator();
        response.statusCode = 200;
        return new NextResponse(JSON.stringify(token ), {
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
