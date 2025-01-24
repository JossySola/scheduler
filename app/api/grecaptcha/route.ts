import { CAPTCHAResponse } from "@/app/lib/definitions";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest): Promise<NextResponse> {
    const payload = await request.json();
    const secret: string | undefined = process.env.POSTGRES_GOOGLE_SECRET;

    if (!payload || !payload.token) {
        return NextResponse.json({
            status: 400,
            error: 'Data missing'
        })
    }
    
    const verify: Response= await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: 'POST',
        body: new URLSearchParams({
            secret: `${secret}`,
            response: `${payload.token}`,
        })
    })
    const response: CAPTCHAResponse = await verify.json();
    
    if (!response.success) {
        if (response["error-codes"]) {
            return NextResponse.json({ error: response["error-codes"][0] }, { status: 400 })
        }
        return NextResponse.json({ error: "Server failure" }, { status: 400 })
    }
    if (response.score < 0.8) {
        return NextResponse.json({ error: "Verification failure" }, { status: 403 })
    }
    return NextResponse.json({ statusText: "Human verified" }, { status: 200 })
}