import { z } from "zod/v4";

export function getLocale(
    pathname: string,
    locales: string[],
    defaultLocale: string,
    acceptLanguage: string | null,
): { locale: string, redirectPath?: string } {
    const verifyPathname = z.string().nonempty().safeParse(pathname);
    if (!verifyPathname.success) {
        console.error("Invalid pathname:", pathname);
        return { locale: defaultLocale };
    }
    const verifyLocales = z.array(z.string().nonempty()).safeParse(locales);
    if (!verifyLocales.success) {
        console.error("Invalid locales array:", locales);
        return { locale: defaultLocale };
    }
    const verifyDefaultLocale = z.string().nonempty().safeParse(defaultLocale);
    if (!verifyDefaultLocale.success) {
        console.error("Invalid default locale:", defaultLocale);
        return { locale: defaultLocale };
    }
    const verifyAcceptLanguage = z.string().nullable().safeParse(acceptLanguage);
    if (!verifyAcceptLanguage.success) {
        console.error("Invalid accept-language header:", acceptLanguage);
        return { locale: defaultLocale };
    }
    const pathnameParts = pathname.split("/");
    const pathnameLocale = pathnameParts[1];
    // Missing locale in the URL, try to get it from the accept-language header and redirect to the correct path
    if (!pathnameLocale || !pathnameLocale.match(/^[a-z]{2}(-[A-Z]{2})?$/)) {
        const userLocale = acceptLanguage
        ?.split(",")[0]
        ?.trim()
        ?.slice(0, 2) ?? defaultLocale;
        
        const finalLocale = locales.includes(userLocale)
        ? userLocale
        : defaultLocale;

        return {
            locale: finalLocale,
            redirectPath: `/${finalLocale}${pathname}`,
        };
    }
    // Unsupported locale in the URL, redirect to the default locale path
    if (pathnameLocale.match(/^[a-z]{2}(-[A-Z]{2})?$/) && !locales.includes(pathnameLocale)) {
        return {
            locale: defaultLocale,
            redirectPath: `/${defaultLocale}${pathname.substring(pathnameLocale.length + 1)}`,
        };
    }
    // Supported locale in the URL, continue with the request
    return {
        locale: pathnameLocale,
    }
}