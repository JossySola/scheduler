// This is the function that works as the Next middleware
import { test as baseTest, describe, expect } from 'vitest';
import { getLocale } from '../../middleware/getLocale';

const test = baseTest.extend<{
    locales: string[];
    defaultLocale: string;
}>({
    locales: ['es', 'en'],
    defaultLocale: "en",
});

describe('Next Middleware', () => {
    describe('getLocale', () => {
        test('returns locale and redirectPath when locale is missing', ({ locales, defaultLocale }) => {
            const { locale, redirectPath } = getLocale("/", locales, defaultLocale, null);
            expect(locale).toBe(defaultLocale);
            expect(redirectPath).toBe(`/${defaultLocale}/`);
            expect(locale).toMatchSnapshot();
            expect(redirectPath).toMatchSnapshot();
        });
        test('adds locale to the path when it is missing', ({ locales, defaultLocale }) => {
            const { locale, redirectPath } = getLocale("/dashboard", locales, defaultLocale, null);
            expect(locale).toBe("en");
            expect(redirectPath).toBe("/en/dashboard");
            expect(locale).toMatchSnapshot();
            expect(redirectPath).toMatchSnapshot();
        });
        test('returns locale and redirectPath when locale is unsupported', ({ locales, defaultLocale }) => {
            const { locale, redirectPath } = getLocale("/fr/dashboard", locales, defaultLocale, null);
            expect(locale).toBe(defaultLocale);
            expect(redirectPath).toBe(`/${defaultLocale}/dashboard`);
            expect(locale).toMatchSnapshot();
            expect(redirectPath).toMatchSnapshot();
        });
        test('returns locale when it is supported', ({ locales, defaultLocale }) => {
            const { locale, redirectPath } = getLocale("/es/dashboard", locales, defaultLocale, null);
            expect(locale).toBe("es");
            expect(redirectPath).toBeUndefined();
            expect(locale).toMatchSnapshot();
            expect(redirectPath).toMatchSnapshot();
        });
        test('returns locale from accept-language header when locale is missing', ({ locales, defaultLocale }) => {
            const { locale, redirectPath } = getLocale("/dashboard", locales, defaultLocale, "es-ES,es;q=0.9,en;q=0.8");
            expect(locale).toBe("es");
            expect(redirectPath).toBe("/es/dashboard");
            expect(locale).toMatchSnapshot();
            expect(redirectPath).toMatchSnapshot();
        });
    })
});