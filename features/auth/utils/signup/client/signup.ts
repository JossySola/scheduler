import * as z from "zod";
import getMultipleZodErrors from "../../../../../lib/utils/getMultipleZodErrors";
import { authClient } from "@/features/auth/auth-client";

export default async function handleSignUp(email: string, password: string, name: string, username: string, callbackURL: string) {
    try {
        const emailVerification = z.email({ error: "Invalid input: expected email" }).nonempty({ error: "Input empty" }).safeParse(email);
        const passwordVerification = z.string({ error: "Invalid input: expected string" }).min(8, { error: "Password must be minimum 8 characters long" }).safeParse(password);
        const nameVerification = z.string({ error: "Invalid input: expected string" }).nonempty({ error: "Input empty" }).safeParse(name);
        const urlVerification = z.string({ error: "Invalid input: expected string" }).nonempty({ error: "Input empty" }).safeParse(callbackURL);
        if (!emailVerification.success 
            || !passwordVerification.success 
            || !nameVerification.success 
            || !urlVerification.success) {
            const messages = getMultipleZodErrors([emailVerification, passwordVerification, nameVerification, urlVerification]);
            throw new Error(`Zod Errors: ${messages}`);
        }
        const { data, error } = await authClient.signUp.email({
            email,
            password,
            name,
            username,
            callbackURL
            }, {
                onRequest: ctx => {

                },
                onSuccess: ctx => {

                },
                onError: ctx => {

                },
            },
        );
        return { data, error }
    } catch (e) {
        console.error(e);
        throw new Error("Failed signing up");
    }
}