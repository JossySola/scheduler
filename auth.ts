import "server-only";
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
                return { ...profile };
            }
        }),
        Facebook({
            clientId: process.env.AUTH_FACEBOOK_ID,
            clientSecret: process.env.AUTH_FACEBOOK_SECRET,
            async profile(profile) {
                return { ...profile };
            }
        }),
        Credentials({
            credentials: {
                username: { label: "Username or e-mail", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                
                if (!credentials || !credentials.username || !credentials.password) {
                    return null;
                }
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/argon/user`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            username: credentials.username,
                            password: credentials.password,
                        })
                    })
                    
                    if (!response.ok || response.status !== 200) {
                        return null;
                    }
                    
                    const { user } = await response.json();
                    return user;
                } catch (error) {
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        jwt({ token, user, account, trigger }) {
            if (user) {
                token.image = user.image;
                token.picture = user.picture;
                if (account) {
                    token.provider = account.provider;
                    token.access_token = account.access_token;
                }
                if (trigger) {
                    token.trigger = trigger;
                }
            }
            return token;
        },
        session({ session, token }) {
            session.user.image = token.image;
            session.user.picture = token.picture;
            session.user.provider = token.provider;
            session.user.trigger = token.trigger;
            session.user.access_token = token.access_token;
            return session;
        },
    },
    pages: {
        signIn: "/login"
    },
    debug: false,
})