import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isOAuthAccessible = createRouteMatcher(['/dashboard(.*)']);
const isApiKeyAccessible = createRouteMatcher(['/api(.*)']);
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute) {
        if (isOAuthAccessible(req)) await auth.protect({ token: 'oauth_token' });
        if (isApiKeyAccessible(req)) await auth.protect({ token: 'api_key' });
    }
}, { debug: true });

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ]
}