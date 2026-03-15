import z from "zod";
import getMultipleZodErrors from "../../../../../lib/utils/getMultipleZodErrors";
import { authClient } from "@/features/auth/utils/auth-client";

export default async function handleSignIn(username: string, password: string, callbackURL: string) {
    try {
        const emailVerification = z.email({ error: "Invalid input: expected email"}).nonempty({ error: "Input empty" }).safeParse(username);
        const passwordVerification = z.string({ error: "Invalid input: expected string" }).min(8, { error: "Password must be minimum 8 characters long" }).safeParse(password);
        const urlVerification = z.string({ error: "Invalid input: expected string" }).nonempty({ error: "Input empty" }).safeParse(callbackURL);
        if (!emailVerification.success || !passwordVerification.success || !urlVerification.success) {
            const messages = getMultipleZodErrors([emailVerification, passwordVerification, urlVerification]);
            throw new Error(`Zod Errors: ${messages}`);
        }
        const { data, error } = await authClient.signIn.username({
            username,
            password,
            callbackURL,
            rememberMe: true
        }, {
            onError: ctx => {
                if (ctx.error.status === 403) {
                    alert("Please verify your email address");
                }
            }
        });
        return { data, error };
    } catch (e) {
        console.error(e)
        throw new Error("Failed signing in");
    }
}