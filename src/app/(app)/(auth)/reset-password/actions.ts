"use server"
import { auth } from "@/auth";
import { resetPasswordSchema } from "@/lib/schemas";
import z from "zod";

export async function requestPasswordResetAction(initialState: { message?: string, errors?: Array<string> }, formData: FormData) {
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
        await auth.api.resetPassword({
            body: {
                newPassword,
                token,
            },
        });
        return {
            message: "Password reset successful",
        }
    } catch (error) {
         console.error(error);
         return { errors: [`${error}`] }
    }
}