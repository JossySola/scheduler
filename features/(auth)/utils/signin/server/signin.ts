import z from "zod";
import getMultipleZodErrors from "../../../../../lib/utils/getMultipleZodErrors";
import { auth } from "@/auth";

export default async function handleSignIn(username: string, password: string) {
    try {
        const emailVerification = z.email({ error: "Invalid input: expected email"}).nonempty({ error: "Input empty" }).safeParse(username);
        const passwordVerification = z.string({ error: "Invalid input: expected string" }).min(8, { error: "Password must be minimum 8 characters long" }).safeParse(password);
        if (!emailVerification.success || !passwordVerification.success) {
            const messages = getMultipleZodErrors([emailVerification, passwordVerification]);
            throw new Error(`Zod Errors: ${messages}`);
        }
        const data = await auth.api.signInUsername({
            body: {
                username,
                password,
            }
        })
        return data;
    } catch (e) {
        console.error(e)
        throw new Error("Failed signing in");
    }
}