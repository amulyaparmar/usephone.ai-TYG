
import { client } from "@/utils/twilio/twilio";
import { NextResponse } from "next/server";

export async function POST(request:any) {
    const req_data = await request.json();
    const callSid = req_data?.CallSid;
    let res = await client.calls(callSid)
      .fetch()
      .then((call:any) => {
        console.log("calllllllll",call)
        return NextResponse.json({ message: call }, { status: 200 });
    });
    ///console.log("res",res)
  // Do whatever you want
}
