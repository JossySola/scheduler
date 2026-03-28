"use server"
import { auth } from "@/auth";
import { updatePasswordSchema } from "@/lib/schemas";
import { headers } from "next/headers";
import z from "zod";

export async function updatePasswordAction(initialState: { message: string }, formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session?.user) {
        return { message: "Unauthorized" }
    }    
    try {
        const currentPassword = formData.get("current-password")?.toString() as string;
        const newPassword = formData.get("new-password")?.toString() as string;
        const verification = updatePasswordSchema.safeParse({
            currentPassword,
            newPassword,
        });
        if (!verification.success) return ({
            message: Object.values(z.flattenError(verification.error).fieldErrors)[0][0],
        })
        await auth.api.changePassword({
            body: {
                newPassword,
                currentPassword,
                revokeOtherSessions: true,
            },
        });
        return {
            message: "Password update successful"
        }
    } catch (error: any) {
        console.error(error);
        return {
            message: `${error.message}`,
        }
    }
}