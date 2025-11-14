"use server"
import { signOut } from "@/auth";
import { headers } from "next/headers";
import "server-only";

export async function SignoutAction (previousState: { message: string }, formData: FormData) {
    const requestHeaders = headers();
    const lang = (await requestHeaders).get("x-user-locale") || "en";
    await signOut({
        redirect: true,
        redirectTo: `${process.env.NEXT_PUBLIC_DEV_ORIGIN}/${lang}/login`
    });
    return {
        message: ""
    }
}