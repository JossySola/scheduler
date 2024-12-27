import "server-only";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z, ZodError } from "zod";
import { getUserFromDb } from "./app/lib/utils-server";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username or e-mail", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                try {
                    let user = null;

                    const username = z.string().min(1).safeParse(credentials.username);
                    const email = z.string().min(1).email("Not an email").safeParse(credentials.username);
                    const password = z.string().min(1).safeParse(credentials.password);
                    
                    if (!username || !email || !password) {
                        return null;
                    }

                    // logic to verify if the user exists on DB
                    user = await getUserFromDb(username.data, email.data, password.data);
                    
                    if (!user) {
                        // No user found, so this is their first attempt to login
                        // Optionally, this is also the place you could do a user registration
                        return null;
                    }

                    // return the user object with their profile data
                    return user;
                } catch (error) {
                    if (error instanceof ZodError) {
                        // Return 'null' to indicate that the credentials are invalid
                        return null;
                    }
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        redirect: async ({ url, baseUrl }) => {
            if (url === '/login') {
                return baseUrl + '/dashboard';
            }

            if (url === '/dashboard') {
                return baseUrl + '/login';
            }

            return url || baseUrl; 
        }
    },
    pages: {
        signIn: "/login"
    },
    debug: true,
})