import "server-only";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import { z } from "zod";
import { getUserFromDb } from "./app/lib/utils-server";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google,
        Facebook,
        Credentials({
            credentials: {
                username: { label: "Username or e-mail", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials || !credentials.username || !credentials.password) {
                    return null;
                }
                try {
                    let user = null;
                    
                    const username = z.string().min(1).safeParse(credentials.username);
                    const email = z.string().min(1).email("Not an email").safeParse(credentials.username);
                    const password = z.string().min(1).safeParse(credentials.password);

                    // logic to verify if the user exists on DB
                    user = await getUserFromDb(username.data, email.data, password.data);
                    
                    if (!user || !user.ok) {
                        // No user found, so this is their first attempt to login
                        // Optionally, this is also the place you could do a user registration
                        return null;
                    }

                    // return the user object with their profile data
                    return user;
                } catch (error) {
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/login"
    },
    debug: true,
})