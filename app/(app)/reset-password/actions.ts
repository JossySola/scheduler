"use server"
import resetPassword from "@/features/auth/utils/resetPassword/server/resetPassword";
import { resetPasswordSchema } from "@/lib/schemas";
import z from "zod";

export async function requestPasswordReset(initialState: { message?: string, errors?: Array<string> }, formData: FormData) {
    try {
        const newPassword = formData.get("password")?.toString() as string;
        const token = formData.get("token")?.toString() as string;
        const verification = resetPasswordSchema.safeParse({
            newPassword,
            token,
        });
        if (!verification.success) return ({
            errors: Object.values(z.flattenError(verification.error).fieldErrors)[0]
        });
        const request = await resetPassword(newPassword, token);
        if (request) {
            return {
                message: "Password reset successful",
            }
        } else {
            return {
                message: "Password could not be reset"
            }
        }
    } catch (error) {
         console.error(error);
         return { message: `${error}`}
    }
}