import "server-only";
import { NextRequest } from "next/server";

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
    const verification = await verify.json();
    console.log(verification)

    return Response.json({ req })
}