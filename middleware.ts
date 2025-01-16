import { NextResponse, NextRequest } from 'next/server';
import { getToken } from "next-auth/jwt";

export async function middleware (request: NextRequest) {
    console.error("[Middleware] Starting...")
    const secret = process.env.NEXTAUTH_SECRET;
    console.error("[Middleware] Secret:", secret)
    const token = await getToken({
        req: request,
        secret: secret
    });
    console.error("[Middleware] Token:", token)
    console.error("[Middleware] nextUrl:", request.nextUrl)
    
    if (!['/','/login', '/signup'].includes(request.nextUrl.pathname)) {
        if (!token) {
            console.error("[Middleware] There is no token, redirecting to /login...")
            return NextResponse.redirect(new URL("/login", request.url));
        }
    } else if (['/login', '/signup', '/try'].includes(request.nextUrl.pathname)) {
        if (token) {
            console.error("[Middleware] There is a token, redirecting to /dashboard...")
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    console.error("[Middleware] Exiting...")
}

export const config = {
    matcher: ['/api', '/dashboard', '/login', '/signup'],
}