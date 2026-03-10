import { auth } from "@/auth";
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
        const data = await auth.api.signUpEmail({
            body: {
                email,
                name,
                password,
                username,
            }
        });
        return data;       
    } catch (e) {
        console.error(e);
        throw new Error("Failed signing up");
    }
}