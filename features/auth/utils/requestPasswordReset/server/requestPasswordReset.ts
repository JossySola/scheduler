import { auth } from "@/auth";
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
        const data = await auth.api.requestPasswordReset({
            body: {
                email,
                redirectTo,
            }
        });
        return data
    } catch (e) {
        console.error(e);
        throw new Error("Failed when requesting a password reset");
    }
}