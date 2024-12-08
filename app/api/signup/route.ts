import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { reCAPTCHAResponse, ReturnReCAPTCHAError } from "@/app/lib/recaptcha/server-recaptcha";

export async function POST (
    request: NextRequest
) {
    
    const req = await request.json();
    const verify = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: 'POST',
        body: new URLSearchParams({
            secret: `${process.env.POSTGRES_GOOGLE_SECRET}`,
            response: `${req['token']}`,
        })
    })
    const verification: reCAPTCHAResponse = await verify.json();
    
    if (verification.success === false) {
        const error = verification['error-codes'][0];
        return ReturnReCAPTCHAError(error);
    }
    /*
    {
        success: true,
        challenge_ts: '2024-12-07T08:57:07Z',
        hostname: 'localhost',
        score: 0.9,
        action: 'signup'
    }

    { success: false, 'error-codes': [ 'invalid-input-response' ] }
    */
    return Response.json({ req })
}