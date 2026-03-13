"use server"
import handleSignUp from "@/features/(auth)/utils/signup/server/signup";
import { signUpSchema } from "@/lib/schemas";
import z from "zod";

export async function signUpAction(initialState: { message?: string, errors?: Array<string> }, formData: FormData) {
    const name= formData.get("name")?.toString() as string;
    const username= formData.get("username")?.toString() as string;
    const email= formData.get("email")?.toString() as string;
    const password= formData.get("password")?.toString() as string;
    const confirmPassword= formData.get("confirm-password")?.toString() as string;

    const verification = signUpSchema.safeParse({
        name,
        username,
        email,
        password,
        confirmPassword
    })
    if (!verification.success) return ({
        errors: Object.values(z.flattenError(verification.error).fieldErrors)[0]
    });    
    if (password !== confirmPassword) return ({
        errors: ["Incorrect password confirmation"]
    });
    const request = await handleSignUp({ 
        email,
        name,
        password,
        username,
    });
    if (request) {
        return {
            message: "User successfully signed up"
        }
    } else {
        return {
            message: "Sign up unsuccessful"
        }
    }
}