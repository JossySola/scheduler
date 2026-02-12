import { NextResponse, NextRequest } from 'next/server';
import { auth as middleware } from "@/auth";
import type { User } from '@auth/core/types';
import { getLocale } from './app/lib/middleware/getLocale';
import { getRedirectUrl } from './app/lib/middleware/getRedirectUrl';

const locales = ['es', 'en'];
const defaultLocale = "en";

export interface AuthenticatedRequest extends NextRequest {
    auth: {
        user: User | null
    }
}

export default middleware((req: AuthenticatedRequest) => {
    const { pathname } = req.nextUrl;
    if (pathname.startsWith("/api")) {
        return NextResponse.next();
    }
    const localeResult = getLocale(pathname, locales, defaultLocale, req.headers.get("accept-language"));
    
    if (localeResult.redirectPath) {
        return NextResponse.redirect(new URL(localeResult.redirectPath, req.url));
    }
    
    const isAuthenticated = !!req.auth?.user;
    const redirectUrl = getRedirectUrl(pathname, localeResult.locale, isAuthenticated);
    
    if (redirectUrl) {
        return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    const response = NextResponse.next();
    response.headers.set("x-user-locale", localeResult.locale);
    return response;
});

export const config = {
    matcher: ["/((?!api|_next/static|auth|_next/image|favicon.ico|assets).*)"],
}