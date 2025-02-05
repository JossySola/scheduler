"use server"
import "server-only";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export async function LogInAction (prevState: { message: string }, formData: FormData) {
    console.log("[LogInAction] Starting...")
    console.log("[LogInAction] formData:", formData)

    const username = formData.get("username");
    const password = formData.get("password");

    if (!formData || !username || !password) {
        console.log("[LogInAction] There is data missing...")
        return {
            message: "Data is missing"
        }
    }
    
    try {
        console.log("[LogInAction] Entering try block...")
        console.log("[LogInAction] Logging in...")
        console.log("[LogInAction] Exiting...")
        const login = await signIn("credentials", {
            username,
            password,
            redirect: false,
        })
        console.log("[LogInAction] Login result:", login)
        console.log("[LogInAction] Redirecting...")
        redirect("/dashboard");
    } catch (error) {
        console.log("[LogInAction] Entering catch block...")
        console.log("[LogInAction] Error:", error)
        console.log("[LogInAction] Exiting...")
        if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
            return {
                message: "Invalid credentials"
            }
        }
        throw error;
    }
    
}