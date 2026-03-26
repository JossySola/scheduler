import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { Pool } from "pg";
import { nextCookies } from "better-auth/next-js";
import { waitUntil } from "@vercel/functions";
import { hashPassword, verifyPassword } from "./src/app/(app)/(auth)/_utils/hashing";
import sendEmail from "./src/app/(app)/(auth)/_utils/sendEmail";

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL + "?sslmode=verify-full",
    }),
    experimental: { joins: true },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
            strategy: "jwe",
        }
    },
    user: {
        deleteUser: {
            enabled: true,
            sendDeleteAccountVerification: async ({
                user,
                url,
                token,
            }, request) => {
                try {
                    waitUntil(sendEmail({
                        to: user.email,
                        subject: "Scheduler: Confirm your account deletion",
                        text: "We are sorry to see you go 😢. Please click on the following button to confirm your account deletion. Note that this action is irreversible.",
                        url,
                        linkText: "Complete account deletion"
                    }));
                } catch (error) {
                    console.error(error);
                    throw new Error(`sendDeleteAccountVerification: ${error}`);                     
                }
            }
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
            try {
                waitUntil(sendEmail({
                    to: user.email,
                    subject: "Scheduler: Sign-up attempt with your email",
                    text: "Someone tried to create an account using your email address. If this was you, try signing in instead. If not, you can safely ignore this email.",
                }));                
            } catch (error) {
                console.error(`onExistingUserSignUp: ${error}`)
                throw new Error(`onExistingUserSignUp: ${error}`);                
            }
        },
        sendResetPassword: async ({ user, url, token }, request) => {
            try {
                waitUntil(sendEmail({
                    to: user.email,
                    subject: "Scheduler: Reset your password",
                    text: `Click the link to reset your password:`,
                    url,
                    linkText: "Reset password"
                }));               
            } catch (error) {
                console.error(`sendResetPassword: ${error}`)
                throw new Error(`sendResetPassword: ${error}`);                
            }

        },
        onPasswordReset: async ({ user }, request) => {
          // callback to execute logic after a password has been successfully reset.  
        },
    },
    emailVerification: {
        autoSignInAfterVerification: true,        
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                waitUntil(sendEmail({
                    to: user.email,
                    subject: "Scheduler: Verify your email address",
                    text: "Complete your sign up process by clicking the following button:",
                    url,
                    linkText: "Confirm email"
                }));                
            } catch (error) {
                console.error(`sendVerificationEmail: ${error}`)
                throw new Error(`sendVerificationEmail: ${error}`);
            }
        },
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