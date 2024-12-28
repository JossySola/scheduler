'use server'
import { signIn } from "@/auth";

export async function LogInAction (prevState: { message: string }, formData: FormData) {
    const username = formData.get('username');
    const password = formData.get('password');
    try {
        await signIn("credentials", { 
            redirect: true, 
            redirectTo: '/dashboard',
            username,
            password
        });
        return {
            message: "Successful"
        }
    } catch (error) {
        return {
            message: "Invalid credentials"
        }
    }
}