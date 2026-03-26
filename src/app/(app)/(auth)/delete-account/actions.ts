"use server"
import { auth } from "@/auth";
import { APIError } from "better-auth";
import { headers } from "next/headers";
import z from "zod";

export async function deleteAccountAction(initialState: { message: string }, formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) {
        return { message: "Unauthorized" }
    }
    try {
        const password = formData.get("password")?.toString() as string;
        const verification = z.string({ error: "Unexpected input format" }).min(8, { error: "The password must be 8 characters long" }).safeParse(password);
        if (!verification.success) {
            return {
                message: verification.error.issues[0].message,
            }
        }
        await auth.api.deleteUser({
            body: {
                password,
                callbackURL: "/goodbye",
            },
            headers: await headers(),
        });
        return {
            message: "You will receive an email to complete the process"
        }
    } catch (error: any) {
        if (error instanceof APIError) {
            console.error(error.message);
            return {
                message: error.message,
            }
        }
        console.error(error);
        return {
            message: error.message
        }
    }
}