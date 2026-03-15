import { authClient } from "@/features/auth/auth-client";
import getMultipleZodErrors from "@/lib/utils/getMultipleZodErrors";
import z from "zod";

export default async function updatePassword(newPassword: string, currentPassword: string) {
    try {
        const newPasswordVerification = z.string().nonempty().safeParse(newPassword);
        const currentPasswordVerification = z.string().nonempty().safeParse(currentPassword);
        if (!newPasswordVerification.success || !currentPasswordVerification.success) {
            const messages = getMultipleZodErrors([newPasswordVerification, currentPasswordVerification]);
            throw new Error(`Zod Errors: ${messages}`);
        }
        const { data, error } = await authClient.changePassword({
            newPassword,
            currentPassword,
            revokeOtherSessions: true,
        });
        if (error) throw new Error(`${error}`);
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(`${error}`);
    }
}