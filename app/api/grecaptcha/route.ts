import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest) {
    const payload = await request.json();
    const secret = process.env.POSTGRES_GOOGLE_SECRET;

    if (!payload || !payload.token) {
        return NextResponse.json({
            status: 400,
            statusText: 'Data missing'
        })
    }
    
    const verify = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: 'POST',
        body: new URLSearchParams({
            secret: `${secret}`,
            response: `${payload.token}`,
        })
    })
    const response = await verify.json();
    
    if (!response.success) {
        if (response["error-codes"]) {
            return NextResponse.json({
                status: 400,
                statusText: response["error-codes"][0],
            })
        }
        return NextResponse.json({
            status: 400,
            statusText: "Server failure",
        })
    }
    if (response.score < 0.8) {
        return NextResponse.json({
            status: 403,
            statusText: "Verification failure",
        })
    }
    return NextResponse.json({
        status: 200,
        statusText: "Human verified",
    })
}