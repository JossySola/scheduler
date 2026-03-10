import { authClient } from "@/features/(auth)/auth-client";
import getMultipleZodErrors from "@/lib/utils/getMultipleZodErrors";
import z from "zod";

export default async function requestPasswordReset(email: string, redirectTo: string) {
    try {
        const verifyEmail = z.string().nonempty().safeParse(email);
        const verifyRedirectTo = z.string().nonempty().safeParse(redirectTo);
        if (!verifyEmail.success || !verifyRedirectTo.success) {
            const messages = getMultipleZodErrors([verifyEmail, verifyRedirectTo]);
            throw new Error(`Zod Errors: ${messages}`);            
        }
        const { data, error } = await authClient.requestPasswordReset({
            email,
            redirectTo,
        });
        if (error) throw new Error(`${error}`);
        return data
    } catch (e) {
        console.error(e);
        throw new Error("Failed when requesting a password reset");
    }
}