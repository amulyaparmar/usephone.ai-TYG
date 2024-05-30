import { client } from "@/utils/twilio/twilio";
import { NextResponse } from "next/server";

export async function POST(request:any) {
    try {
        const req_data = await request.json();
        const callSid = req_data?.CallSid;

        if (!callSid) {
            throw new Error("CallSid is required.");
        }

        const recordings = await client.recordings.list({ callSid, limit: 20 });

        // Assuming recordings have the necessary data you want to send back
        return new NextResponse(JSON.stringify({ success: true,recordings: recordings }), {
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
