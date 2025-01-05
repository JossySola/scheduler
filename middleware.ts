import { NextResponse, NextRequest } from 'next/server'
import { reCAPTCHAResponse, VerificationResponse } from './app/lib/recaptcha/server-recaptcha';
import { ReturnReCAPTCHAError } from './app/lib/recaptcha/server-recaptcha';
import { auth } from '@/auth';
import { getToken } from 'next-auth/jwt';

export default auth(async (request: NextRequest) => {
    if (request.nextUrl.pathname.startsWith('/api/signup') || request.nextUrl.pathname.startsWith('/api/login')) {
        const googleResponse: VerificationResponse = await GoogleVerification(request);    
        if (googleResponse.status !== 200) {
            return NextResponse.json(googleResponse);
        }
        return NextResponse.next();
    }
    
    if (!['/','/login', '/signup'].includes(request.nextUrl.pathname)) {
        const secret = process.env.NEXTAUTH_SECRET;
        
        const token = await getToken({
            req: request,
            secret: secret
        });
        
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    } else {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
})

export const config = {
    matcher: ['/api', '/dashboard', '/login', '/signup'],
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
        return ReturnReCAPTCHAError(verification['error-codes'][0]);
    }
    if (verification.score < 0.8) {
        return {
            status: 401,
            statusText: 'Requires human verification'
        }
    }
    return {
        status: 200,
        statusText: 'Verified!'
    }
}