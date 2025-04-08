"use server"
import { signOut } from "@/auth";
import { cookies, headers } from "next/headers";
import "server-only";

export async function SignoutAction (previousState: { message: string }, formData: FormData) {
    const requestHeaders = headers();
    const lang = (await requestHeaders).get("x-user-locale") || "en";
    const cookieStore = await cookies();
    await signOut({
        redirect: true,
        redirectTo: `/${lang}/login`
    });
    return {
        message: ""
    }
}