export function getRedirectUrl(
    pathname: string,
    locale: string,
    isAuthenticated: boolean,
): string | null {
    if ([`/${locale}/login`, `/${locale}/signup`].includes(pathname) && isAuthenticated) {
        return `/${locale}/dashboard`;
    }
    if ([`/${locale}/dashboard`, `/${locale}/table`].includes(pathname) && !isAuthenticated) {
        return `/${locale}/login`;
    }
    return null;
}