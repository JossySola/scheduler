import { NextResponse, NextRequest } from 'next/server';
import { auth as middleware } from "@/auth";
import type { User } from '@auth/core/types';

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

    const pathnameParts = pathname.split("/");
    const pathnameLocale = pathnameParts[1];
    const locale = locales.includes(pathnameLocale) ? pathnameLocale : "en";
    if (locale === "es" || locale === "en") {
        if ([`/${locale}/login`, `/${locale}/signup`].includes(pathname) && req.auth) {
            return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
        }
        if ([`/${locale}/dashboard`, `/${locale}/table`, `/${locale}/table/`].includes(pathname) && !req.auth) {
            return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
        }
    }

    const response = NextResponse.next();
    response.headers.set("x-user-locale", locale);
    // If no locale is in the URL, detect the user's locale and redirect
    if (!pathnameLocale) {
        // Detect the user's preferred language (from accept-language header)
        const acceptLanguage = req.headers.get("accept-language") || defaultLocale;
        const userLocale = acceptLanguage.split(",")[0].trim().slice(0, 2);
        const finalLocale = locales.includes(userLocale) ? userLocale : defaultLocale;
        const redirectUrl = new URL(`/${finalLocale}${pathname}`, req.url);
        return NextResponse.redirect(redirectUrl);
    }
    // Check if the path contains a supported locale
    const isSupportedLocale = locales.includes(pathnameLocale);
    // If an unsupported locale is present in the URL, replace it
    if (pathnameLocale && !isSupportedLocale) {
        const redirectUrl = new URL(`/${defaultLocale}${pathname.substring(pathnameLocale.length + 1)}`, req.url);
        return NextResponse.redirect(redirectUrl);
    }
    return response;
});
export const config = {
    matcher: ["/((?!api|_next/static|auth|_next/image|favicon.ico).*)"],
}