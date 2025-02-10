import "server-only";
import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            async profile(profile) {
                const imageUrl = profile.picture;
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/signup`, {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            name: profile.name,
                            username: profile.name,
                            email: profile.email,
                            provider: 'Google',
                            image: imageUrl,
                        })
                    })
                    if (!response.ok) console.error("Signup API request failed", await response.text());
                } catch (error) {
                    console.error("Error during signup API call:", error);
                }
                return { ...profile };
            }
        }),
        Facebook({
            clientId: process.env.AUTH_FACEBOOK_ID,
            clientSecret: process.env.AUTH_FACEBOOK_SECRET,
            async profile(profile) {
                const imageUrl = profile.picture.data.url;
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/signup`, {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            name: profile.name,
                            username: profile.name,
                            email: profile.email,
                            provider: 'Facebook',
                            image: imageUrl,
                        })
                    })
                    if (!response.ok) console.error("Signup API request failed", await response.text());
                } catch (error) {
                    console.error("Error during signup API call:", error);
                }
                return { ...profile };
            }
        }),
        Credentials({
            credentials: {
                username: { label: "Username or e-mail", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const request = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/argon/user`, {
                    method: 'POST',
                    body: JSON.stringify({
                        username: credentials.username,
                        password: credentials.password,
                    })
                });
                const response = await request.json();
                
                if (response.error || !request.ok) {
                    throw new AuthError(response.error, { cause: { next_attempt: response.next_attempt } });
                }
                
                return response.user;
            },
        }),
    ],
    callbacks: {
        async jwt ({ token, account, profile }) {
            if (account && profile) {
                const provider = account.provider;
                const isGoogle = provider === 'google';
                const isFacebook = provider === 'facebook';

                if (isGoogle || isFacebook) {
                    if (isGoogle) {
                        token.googleAccessToken = account.access_token;
                        token.googleSub = account.providerAccountId;
                    } else if (isFacebook) {
                        token.facebookAccessToken = account.access_token;
                        token.facebookSub = account.providerAccountId;
                    }
                }
            }
            
            return token;
        },
        async session ({ session, token }) {
            session.user = session.user || {};

            if (token.googleAccessToken && token.googleSub) {
                session.googleAccessToken = token.googleAccessToken;
                session.user.googleSub = token.googleSub;
            }
            if (token.facebookAccessToken && token.facebookSub) {
                session.facebookAccessToken = token.facebookAccessToken;
                session.user.facebookSub = token.facebookSub;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            const defaultLocale = "en";
            const urlObject = new URL(url, baseUrl);
            const pathnameParts = urlObject.pathname.split("/");

            const isLocalePresent = ["es", "en"].includes(pathnameParts[1]);
            const locale = isLocalePresent ? pathnameParts[1] : defaultLocale;

            if (url.startsWith("/login")) {
                return `/${locale}/login`;
            }
            return url;
        },
    },
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login",
    },
    debug: true,
})