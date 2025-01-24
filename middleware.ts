import { NextResponse, NextRequest } from 'next/server';
import { getToken } from "next-auth/jwt";
import { auth } from './auth';

export async function middleware (request: NextRequest) {
    console.error("[Middleware] Starting...");
    /*
    const secret = process.env.NEXTAUTH_SECRET;
    console.error("[Middleware] Secret:", secret)
    const token = await getToken({
        req: request,
        secret: secret
    });
    console.error("[Middleware] Token:", token)
    console.error("[Middleware] nextUrl:", request.nextUrl)
    */
    const session = await auth();
    console.error("[Middleware] Session:",session)
    
    if (["/", "/login", "/signup", "/try"].includes(request.nextUrl.pathname)) {
        if (session?.user) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }
    if (["/dashboard", "/table"].includes(request.nextUrl.pathname)) {
        if (!session?.user) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    console.error("[Middleware] Exiting...")
}

export const config = {
    matcher: ['/', '/login', '/signup', '/try', '/dashboard', '/table'],
}