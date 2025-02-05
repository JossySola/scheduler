declare module 'server-only';

interface Window {
    grecaptcha: {
        ready: (callback: () => void) => void;
        execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
}