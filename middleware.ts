import { NextResponse, NextRequest } from 'next/server';
import { getToken } from "next-auth/jwt";

const locales = ['es', 'en'];
const defaultLocale = "en";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    // Extract potential locale from the path
    const pathnameParts = pathname.split("/");
    const pathnameLocale = pathnameParts[1]; // First part after "/"
    const locale = locales.includes(pathnameLocale) ? pathnameLocale : "en";
    const response = NextResponse.next();
    response.headers.set("x-user-locale", locale);
    

    // Check if the path contains a supported locale
    const isSupportedLocale = locales.includes(pathnameLocale);

    // Detect the user's preferred language (from accept-language header)
    const acceptLanguage = request.headers.get("accept-language") || defaultLocale;
    const userLocale = acceptLanguage.split(",")[0].trim().slice(0, 2);

    // If an unsupported locale is present in the URL, replace it
    if (pathnameLocale && !isSupportedLocale) {
        const redirectUrl = new URL(`/${defaultLocale}${pathname.substring(pathnameLocale.length + 1)}`, request.url);
        return NextResponse.redirect(redirectUrl);
    }

    // If no locale is in the URL, detect the user's locale and redirect
    if (!pathnameLocale) {
        const finalLocale = locales.includes(userLocale) ? userLocale : defaultLocale;
        const redirectUrl = new URL(`/${finalLocale}${pathname}`, request.url);
        return NextResponse.redirect(redirectUrl);
    }

    // Authentication logic
    const secret = process.env.NEXTAUTH_SECRET;
    const token = await getToken({ req: request, secret });

    if ([`/${locale}/login`, `/${locale}/signup`, `/${locale}/try`].includes(pathname) && token) {
        return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }

    if ([`/${locale}/dashboard`, `/${locale}/table`].includes(pathname) && !token) {
        return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    return response;
}

export const config = {
    matcher: ["/((?!_next|auth|favicon.ico).*)"],
}