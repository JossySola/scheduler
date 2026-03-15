import { authClient } from "@/features/auth/utils/auth-client";
import getMultipleZodErrors from "@/lib/utils/getMultipleZodErrors";
import z from "zod";

export default async function newPassword(newPassword: string, token: string) {
    // const token = new URLSearchParams(window.location.search).get("token");
    try {
        const passwordVerification = z.string().nonempty().safeParse(newPassword);
        const tokenVerification = z.string().nonempty().safeParse(token);
        if (!passwordVerification.success || !tokenVerification.success) {
            const messages = getMultipleZodErrors([passwordVerification, tokenVerification]);
            throw new Error(`Zod Errors: ${messages}`);
        }
        const { data, error } = await authClient.resetPassword({
            newPassword,
            token,
        });
        if (error) throw new Error(`${error}`);
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Failed setting a new password");
    }
}