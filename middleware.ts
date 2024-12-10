import { NextResponse, NextRequest } from 'next/server'
import { reCAPTCHAResponse } from './app/lib/recaptcha/server-recaptcha';
import { ReturnReCAPTCHAError } from './app/lib/recaptcha/server-recaptcha';

export async function middleware (request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/api')) {
        const googleResponse = await GoogleVerification(request);
        
        if (!googleResponse.success || googleResponse.score < 0.8) {
            return NextResponse.json(googleResponse);
        }
        return NextResponse.next();
    }
}

export const config = {
    matcher: ['/api/signup'],
}

const GoogleVerification = async (request: NextRequest) => {
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
    return verification
}