import { z } from "zod/v4";

export function getRedirectUrl(
    pathname: string,
    locale: string,
    isAuthenticated: boolean,
): string | null {
    const verifyPathname = z.string().nonempty().safeParse(pathname);
    if (!verifyPathname.success) {
        console.error("Invalid pathname:", pathname);
        return null;
    }
    const verifyLocale = z.string().nonempty().safeParse(locale);
    if (!verifyLocale.success) {
        console.error("Invalid locale:", locale);
        return null;
    }
    const verifyAuth = z.boolean().safeParse(isAuthenticated);
    if (!verifyAuth.success) {
        console.error("Invalid authentication status:", isAuthenticated);
        return null;
    }
    if ([`/${locale}/login`, `/${locale}/signup`].includes(pathname) && isAuthenticated) {
        return `/${locale}/dashboard`;
    }
    if ([`/${locale}/dashboard`, `/${locale}/table`].includes(pathname) && !isAuthenticated) {
        return `/${locale}/login`;
    }
    return null;
}