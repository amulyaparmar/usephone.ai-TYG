import { NextResponse } from "next/server";
import axios from 'axios';
import FormData from 'form-data';

export async function POST(request:any, response:any) {
    try {

        return new NextResponse(JSON.stringify({ success: true, 
            message: "POST! TYG!",
            result: ""
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
    } catch (error:any) {
        console.error("Error: ", error.message);

        // Send an error response back
        return new NextResponse(JSON.stringify({ success: false, 
            message: error.message
         }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export async function GET(request:any, response:any) {
    try {
        

        return new NextResponse(JSON.stringify({ success: true, 
            message: "GET! TYG!",
            result: ""
        }), {
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