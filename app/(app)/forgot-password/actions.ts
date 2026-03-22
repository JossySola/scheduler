"use server"
import { auth } from "@/auth";
import z from "zod";

export async function forgotPasswordAction(initialState: { message?: string, errors?: Array<string> }, formData: FormData) {
    try {
        const email = formData.get("email")?.toString();
        if (!email) return { message: "Email field should not be empty" }
        const inputVerification = z.email().nonempty().safeParse(email);
        if (!inputVerification.success) {
            return {
                errors: ["Invalid email address"]
            }
        }
        await auth.api.requestPasswordReset({
            body: {
                email,
                redirectTo: `${process.env.NEXTAUTH_URL}/reset-password`,
            }
        });
        return {
            message: "The email has been sent!"
        }
    } catch (error) {
        return {
            message: "The email couldn't be sent"
        }
    }
}