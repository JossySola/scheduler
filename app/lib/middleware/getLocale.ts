export function getLocale(
    pathname: string,
    locales: string[],
    defaultLocale: string,
    acceptLanguage: string | null,
): { locale: string, redirectPath?: string } {
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