import "server-only"
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        Facebook({
            clientId: process.env.AUTH_FACEBOOK_ID,
            clientSecret: process.env.AUTH_FACEBOOK_SECRET,
        }),
        Credentials({
            credentials: {
                username: { label: "Username or e-mail", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("[Auth Credentials authorize] Starting...")
                console.log("[Auth Credentials authorize] Credentials:", credentials)
                console.log("[Auth Credentials authorize] Fetching /api/argon/user...")
                const response = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/argon/user`, {
                    method: 'POST',
                    body: JSON.stringify({
                        username: credentials.username,
                        password: credentials.password,
                    })
                });
                console.log("[Auth Credentials authorize] Fetch response:", response)
                
                if (!response.ok) {
                    console.log("[Auth Credentials authorize] Parsed response status is not 200")
                    console.log("[Auth Credentials authorize] Exiting...")
                    throw new Error ("Invalid credentials.");
                }

                const data = await response.json();
                console.log("[Auth Credentials authorize] JSON parse:", data)
                console.log("[Auth Credentials authorize] Exiting...")
                return data.user;
            },
        }),
    ],
    callbacks: {
        async jwt ({ token, account, profile, trigger }) {
            if (trigger === 'signUp') {
                if (account && profile) {
                    if (account.provider && account.provider === 'google') {
                        await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/signup`, {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                name: profile.name,
                                username: profile.name,
                                email: profile.email,
                                provider: 'Google',
                                image: profile.picture.data.url
                            })
                        })
                        token.googleAccessToken = account.access_token;
                        token.googleSub = profile?.sub || account.providerAccountId;
                    } else if (account.provider && account.provider === 'facebook') {
                        await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/signup`, {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                name: profile.name,
                                username: profile.name,
                                email: profile.email,
                                provider: 'Facebook',
                                image: profile.picture.data.url
                            })
                        })
                        token.facebookAccessToken = account.access_token;
                        token.facebookSub = profile?.sub || account.providerAccountId;
                    }
                }
            }
            
            return token;
        },
        async session ({ session, token }) {
            if (token.googleAccessToken && token.googleSub) {
                session.googleAccessToken = token.googleAccessToken;
                session.user.googleSub = token.googleSub;
            }
            if (token.facebookAccessToken && token.facebookSub) {
                session.facebookAccessToken = token.facebookAccessToken;
                session.user.facebookSub = token.facebookSub;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login",
    },
    debug: false,
})