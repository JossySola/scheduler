"use server"
import requestPasswordReset from "@/features/auth/utils/requestPasswordReset/server/requestPasswordReset";
import z from "zod";

export async function forgotPasswordAction(initialState: { message: string }, formData: FormData) {
    try {
        const email = formData.get("email")?.toString();
        const inputVerification = z.email().nonempty().safeParse(email);
        if (!inputVerification.success || !email) {
            return {
                message: "Invalid or empty email address"
            }
        }
        const request = await requestPasswordReset(email, `${process.env.NEXTAUTH_URL}/reset-password`);
        if (request.status) {
            return {
                message: "The email has been sent!"
            }
        } else {
            throw new Error();
        }
    } catch (error) {
        return {
            message: "The email couldn't be sent"
        }
    }
}