"use server"
import handleSignIn from "@/features/auth/utils/signin/server/signin";
import { signInSchema } from "@/lib/schemas";
import z from "zod";

export async function signInAction(initialState: { message?: string, errors?: Array<string> }, formData: FormData) {
    try {
        const username = formData.get("username")?.toString() as string;
        const password = formData.get("password")?.toString() as string;

        const verification = signInSchema.safeParse({
            username,
            password,
        })
        if (!verification.success) return ({
            errors: Object.values(z.flattenError(verification.error).fieldErrors)[0]
        });
        const request = await handleSignIn(username, password);
        if (request) {
            return {
                message: "User signed in successfully"
            }
        } else {
            return {
                message: "Sign in unsuccessful"
            }
        }
    } catch (e: any) {
        console.error(e);
        if (e.message.includes("Invalid username")) {
            return { message: "Invalid credentials" }
        } else if (e.message.includes("Email not verified")) {
            return { message: "Email not verified" }
        }        
        return { message: `${e}` }
    }
}