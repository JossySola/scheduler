import "server-only"
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import * as argon2 from "argon2"
import { logInSchema } from "./app/lib/zod";
import { ZodError } from "zod";
import { getUserFromDb } from "./app/lib/utils";

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
                    const [ username, email, password ] = await Promise.all([
                        logInSchema.username.parseAsync(credentials.username),
                        logInSchema.email.parseAsync(credentials.username),
                        logInSchema.password.parseAsync(credentials.password),
                    ]);

                    // logic to verify if the user exists on DB
                    user = await getUserFromDb(username, email, password);
                    if (!user) {
                        // No user found, so this is their first attempt to login
                        // Optionally, this is also the place you could do a user registration
                        throw new Error("Invalid credentials.");
                    }

                    // return the user object with their profile data
                    return user;
                } catch (error) {
                    console.error(error);
                    if (error instanceof ZodError) {
                        // Return 'null' to indicate that the credentials are invalid
                        return null;
                    }
                }
            },
        }),
    ],
    pages: {
        signIn: "/login"
    },
    debug: true,
})