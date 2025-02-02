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
            async profile(profile) {
                console.log("[Auth Providers Google] Starting...")
                console.log("[Auth Providers Google] Fetching /api/signup")
                const signup = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/signup`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: profile.name,
                        username: profile.name,
                        email: profile.email,
                        provider: 'Google',
                        image: profile.picture,
                    })
                })
                console.log("[Auth Providers Google] Fetch result:", signup)
                console.log("[Auth Providers Google] Exiting...")
                return { ...profile };
            }
        }),
        Facebook({
            clientId: process.env.AUTH_FACEBOOK_ID,
            clientSecret: process.env.AUTH_FACEBOOK_SECRET,
            async profile(profile) {
                console.log("[Auth Providers Facebook] Starting...")
                console.log("[Auth Providers Facebook] Fetching /api/signup")
                const signup = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/signup`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: profile.name,
                        username: profile.name,
                        email: profile.email,
                        provider: 'Facebook',
                        image: profile.picture.data.url,
                    })
                })
                console.log("[Auth Providers Facebook] Fetch result:", signup)
                console.log("[Auth Providers Facebook] Exiting...")
                return { ...profile };
            }
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
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login",
    },
    debug: false,
})