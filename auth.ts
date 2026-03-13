import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { Pool } from "pg";
import { nextCookies } from "better-auth/next-js";
import sendEmail from "./features/(auth)/utils/sendEmail/sendEmail";
import { hashPassword, verifyPassword } from "./features/(auth)/utils/hashing/hashing";

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
    }),
    experimental: { joins: true },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        }
    },
    emailAndPassword: {
        enabled: true,
        password: {
            hash: hashPassword,
            verify: verifyPassword,
        },
        requireEmailVerification: true,
        onExistingUserSignUp: async ({ user }, request) => {
            void sendEmail({
                to: user.email,
                subject: "Sign-up attempt with your email",
                text: "Someone tried to create an account using your email address. If this was you, try signing in instead. If not, you can safely ignore this email.",
            })
        },
        sendResetPassword: async ({ user, url, token }, request) => {
            void sendEmail({
                to: user.email,
                subject: "Reset your password",
                text: `Click the link to reset your password: ${url}`,
            });
        },
        onPasswordReset: async ({ user }, request) => {
          // callback to execute logic after a password has been successfully reset.  
        }
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }, request) => {
            void sendEmail({
                to: user.email,
                subject: "Verify your email address",
                text: `Click the link to verify your email: ${url}`,
            })
        }
    },
    socialProviders: {
        facebook: {
            clientId: process.env.AUTH_FACEBOOK_ID as string,
            clientSecret: process.env.AUTH_FACEBOOK_SECRET as string,
        },
        google: {
            prompt: "select_account",
            clientId: process.env.AUTH_GOOGLE_ID as string,
            clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
        },
        microsoft: {
            clientId: process.env.AUTH_MICROSOFT_ID as string,
            clientSecret: process.env.AUTH_MICROSOFT_SECRET as string,
        }
    },
    plugins: [username(), nextCookies()],
});