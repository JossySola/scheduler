"use server"
import "server-only";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { headers } from "next/headers";

export async function LogInAction (prevState: { message: string }, formData: FormData) {
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";
    console.log("[LogInAction] Starting...")
    console.log("[LogInAction] formData:", formData)

    const username = formData.get("username");
    const password = formData.get("password");

    if (!formData || !username || !password) {
        console.log("[LogInAction] There is data missing...")
        return {
            message: locale === "es" ? "Por favor, llena todos los campos/" : "Please, fill out both fields/"
        }
    }
    
    try {
        console.log("[LogInAction] Entering try block...")
        console.log("[LogInAction] Logging in...")
        console.log("[LogInAction] Exiting...")
        await signIn("credentials", {
            username,
            password,
            redirect: true,
            redirectTo: `/${locale}/dashboard`
        })
        return {
            message: "Logged in"
        }
    } catch (error) {
        console.log("[LogInAction] Entering catch block...")
        console.log("[LogInAction] Error", error)

        let errorMessage = locale === "es" ? "Error interno/" : "Unknown error/";
        if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
            if (error instanceof AuthError) {
                errorMessage = `${error.message}/`;
                if (error.cause?.next_attempt) {
                    errorMessage += `/${error.cause.next_attempt}`;
                }
            } else if (error instanceof Error) {
                errorMessage = `${error.message}/`;
            }
            return { message: `${errorMessage}/` };
        }
        throw error;
    }
}