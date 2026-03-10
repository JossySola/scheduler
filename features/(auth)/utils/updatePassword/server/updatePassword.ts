import { auth } from "@/auth";
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
        const data = await auth.api.changePassword({
            body: {
                newPassword,
                currentPassword,
                revokeOtherSessions: true,
            }
        });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(`${error}`);
    }
}