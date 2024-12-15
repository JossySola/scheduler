import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import * as argon2 from "argon2"
import { logInSchema } from "./app/lib/zod";
import { ZodError } from "zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: {},
                password: {},
            },
            authorize: async (credentials) => {
                try {
                    let user = null;
                    const { username, password } = await logInSchema.parseAsync(credentials);

                    const hashedPassword = await argon2.hash(credentials.password);

                    // logic to verify if the user exists on DB

                    if (!user) {
                        // No user found, so this is their first attempt to login
                        // Optionally, this is also the place you could do a user registration
                        throw new Error("Invalid credentials.");
                    }

                    // return the user object with their profile data
                    return user;

                } catch (error) {
                    if (error instanceof ZodError) {
                        // Return 'null' to indicate that the credentials are invalid
                        return null;
                    }
                }
            },
        }),
    ],
})