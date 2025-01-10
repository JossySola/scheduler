import { NextResponse, NextRequest } from 'next/server';

export async function middleware (request: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET;
    const token = await getToken({
        req: request,
        secret: secret
    });
    
    if (!['/','/login', '/signup'].includes(request.nextUrl.pathname)) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    } else if (['/login', '/signup', '/reset'].includes(request.nextUrl.pathname)) {
        if (token) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }
})

export const config = {
    matcher: ['/api', '/dashboard', '/login', '/signup'],
}