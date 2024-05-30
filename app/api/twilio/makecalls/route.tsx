import { client } from "@/utils/twilio/twilio";
import { NextResponse } from "next/server";

export async function POST(request:any, response:any) {
    try {
        // const { numbers } = request.body; // Assume an array of numbers to dial

        response.statusCode = 200;
        return new NextResponse(JSON.stringify({ success: false, message: "POST Calls are begin made! TYG!" }), {
            status: 500,
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
        response.json({ message: 'POST is being made! TYG!' });
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
