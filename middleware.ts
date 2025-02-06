import { NextResponse, NextRequest } from 'next/server';
import { getToken } from "next-auth/jwt";

export async function middleware (request: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET;
    const token = await getToken({
        req: request,
        secret: secret
    });
    if (["/", "/login", "/signup", "/try"].includes(request.nextUrl.pathname)) {
        if (token) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }
    if (["/dashboard", "/table"].includes(request.nextUrl.pathname)) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }
}

export const config = {
    matcher: ['/', '/api', '/login', '/signup', '/try', '/dashboard', '/table'],
}