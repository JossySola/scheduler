'use server'
import { signIn } from "@/auth";

export async function LogInAction (prevState: { message: string }, formData: FormData) {
    const username = formData.get('username');
    const password = formData.get('password');
    
    const result = await signIn("credentials", {
        redirect: true,
        redirectTo: '/dashboard',
        username,
        password,
    });

    if (!result) {
        return {
            message: "Invalid credentials (action)"
        }
    }
}