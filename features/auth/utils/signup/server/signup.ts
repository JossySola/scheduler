import { auth } from "@/auth";
import { SignUpEmailData } from "@/lib/definitions";
import getMultipleZodErrors from "@/lib/utils/getMultipleZodErrors";
import z from "zod";

export default async function handleSignUp({ email, name, password, username }: { email: string, name: string, password: string, username: string }) {
    try {
        const emailVerification = z.email({ error: "Invalid input: expected email" }).nonempty({ error: "Input empty" }).safeParse(email);
        const passwordVerification = z.string({ error: "Invalid input: expected string" }).min(8, { error: "Password must be minimum 8 characters long" }).safeParse(password);
        const nameVerification = z.string({ error: "Invalid input: expected string" }).nonempty({ error: "Input empty" }).safeParse(name);
        if (!emailVerification.success 
            || !passwordVerification.success 
            || !nameVerification.success) {
            const messages = getMultipleZodErrors([emailVerification, passwordVerification, nameVerification]);
            throw new Error(`Zod Errors: ${messages}`);
        }
        const data: SignUpEmailData = await auth.api.signUpEmail({
            body: {
                email,
                name,
                password,
                username,
            }
        });
        return data;       
    } catch (e: any) {
    // better-auth throws when onExistingUserSignUp rejects
        const msg = e?.message ?? "";
        if (msg.includes("credits exceeded") || msg.includes("Unauthorized")) {
            throw new Error("Email service unavailable. Please try again later.");
        }
        throw new Error(msg);
    }
}