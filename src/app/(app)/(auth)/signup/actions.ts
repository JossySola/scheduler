"use server"
import { auth } from "@/auth";
import { SignUpEmailData } from "@/lib/definitions";
import { signUpSchema } from "@/lib/schemas";
import z from "zod";

export async function signUpAction(initialState: { message: string }, formData: FormData) {
    try {
        const name = formData.get("name")?.toString() as string;
        const username = formData.get("username")?.toString() as string;
        const email = formData.get("email")?.toString() as string;
        const password = formData.get("password")?.toString() as string;
        const confirmPassword = formData.get("confirm-password")?.toString() as string;

        const verification = signUpSchema.safeParse({
            name,
            username,
            email,
            password,
            confirmPassword,
        })
        if (!verification.success) return ({
            message: Object.values(z.flattenError(verification.error).fieldErrors)[0][0]
        });    
        if (password !== confirmPassword) return ({
            message: "Incorrect password confirmation"
        });
        const request: SignUpEmailData = await auth.api.signUpEmail({
            body: {
                email,
                name,
                password,
                username,
            }
        });
        if (request) {
            return {
                message: "A confirmation email has been sent, please check your inbox to complete the sign up process."
            }
        } else {
            return {
                message: "Sign up unsuccessful"
            }
        }
    } catch (e: any) {
        console.error(e);
        return { message: `${e.message}` }
    }
}