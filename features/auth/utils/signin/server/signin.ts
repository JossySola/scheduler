import z from "zod";
import getMultipleZodErrors from "@/lib/utils/getMultipleZodErrors";
import { auth } from "@/auth";
import { SignInUsernameData } from "@/lib/definitions";

export default async function handleSignIn(username: string, password: string) {
    try {
        const emailVerification = z.string({ error: "Invalid input: expected string" }).nonempty({ error: "Input empty" }).safeParse(username);
        const passwordVerification = z.string({ error: "Invalid input: expected string" }).min(8, { error: "Password must be minimum 8 characters long" }).safeParse(password);
        if (!emailVerification.success || !passwordVerification.success) {
            const messages = getMultipleZodErrors([emailVerification, passwordVerification]);
            throw new Error(`Zod Errors: ${messages}`);
        }
        const data: SignInUsernameData = await auth.api.signInUsername({
            body: {
                username,
                password,
                rememberMe: true,
                callbackURL: "/dashboard",
            },
        });
        return data;
    } catch (e: any) {
        console.error(e);
        console.error(e.message);
        if (e.message.includes("Invalid username")) {
            throw new Error("Invalid credentials");
        } else if (e.message.includes("Email not verified")) {
            throw new Error("Email not verified");
        }
        throw new Error(`${e.message}`);
    }
}