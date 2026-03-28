"use server"
import { auth } from "@/auth";
import { resetPasswordSchema } from "@/lib/schemas";
import { headers } from "next/headers";
import z from "zod";

export async function requestPasswordResetAction(initialState: { message: string }, formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session?.user) {
        return { message: "Unauthorized" }
    }    
    try {
        const newPassword = formData.get("password")?.toString() as string;
        const token = formData.get("token")?.toString() as string;
        const verification = resetPasswordSchema.safeParse({
            newPassword,
            token,
        });
        if (!verification.success) return ({
            message: Object.values(z.flattenError(verification.error).fieldErrors)[0][0]
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
    } catch (error: any) {
         console.error(error);
         return { message: `${error.message}` }
    }
}