import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import * as argon2 from "argon2"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                username: {},
                password: {},
            },
            authorize: async (credentials) => {
                let user = null;
                const hashedPassword = await argon2.hash(credentials.password);

                // logic to verify if the user exists on DB

                if (!user) {
                    // No user found, so this is their first attempt to login
                    // Optionally, this is also the place you could do a user registration
                    throw new Error("Invalid credentials.");
                }

                // return the user object with their profile data
                return user;
            }
        })
    ],
})