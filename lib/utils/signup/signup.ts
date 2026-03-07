import * as z from "zod";
import getMultipleZodErrors from "../getMultipleZodErrors";

export default function handleSignUp(email: string, password: string, name: string, callbackURL: string) {
    try {
        const emailVerification = z.email({ error: "Invalid input: expected email" }).nonempty({ error: "Input empty" }).safeParse(email);
        const passwordVerification = z.string({ error: "Invalid input: expected string" }).min(8).safeParse(password);
        const nameVerification = z.string({ error: "Invalid input: expected string" }).nonempty({ error: "Input empty" }).safeParse(name);
        const urlVerification = z.string({ error: "Invalid input: expected string" }).nonempty({ error: "Input empty" }).safeParse(callbackURL);
        if (!emailVerification.success 
            || !passwordVerification.success 
            || !nameVerification.success 
            || !urlVerification.success) {
            const messages = getMultipleZodErrors([emailVerification, passwordVerification, nameVerification, urlVerification]);
            console.error(`Zod Errors: ${messages}`);
            throw new Error(`Zod Errors: ${messages}`);
        }
    } catch (e) {
        
    }
}