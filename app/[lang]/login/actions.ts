"use server"
import "server-only";
import { signIn } from "@/auth";
import { headers } from "next/headers";

export async function LogInAction (prevState: { message: string, nextAttempt: number | null }, formData: FormData) {
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";

    const username = formData.get("username");
    const password = formData.get("password");

    if (!formData || !username || !password) {
        return {
            message: locale === "es" ? "Por favor, llena todos los campos" : "Please, fill out both fields",
            nextAttempt: null,
        }
    }
    
    try {
        await signIn("credentials", {
            username,
            password,
            redirect: true,
            redirectTo: `/${locale}/dashboard`,
        })
        return {
            message: "Logged in",
            nextAttempt: null,
        }
    } catch (error) {
        if (error.type && error.type === "CallbackRouteError") {
            const cause = error.cause.err.cause;
            if (error.cause.next_attempt) {
                return {
                    message: locale === "es" ? "Información inválida" : "Invalid credentials",
                    nextAttempt: error.cause.next_attempt as number,
                }
            }
            if (cause === 404) {
                return {
                    message: locale === "es" ? "Usuario no existe" : "User not found",
                    nextAttempt: null,
                }
            } else if (cause === 409) {
                return {
                    message: locale === "es" ? "Registro incorrecto. Favor de reportar error" : "Bad registry. Please report this specific issue",
                    nextAttempt: null,
                }
            } else if (cause === 500) {
                return {
                    message: locale === "es" ? "Error interno" : "Internal Error",
                    nextAttempt: null,
                }
            } else if (cause == 400) {
                return {
                    message: locale === "es" ? "Has iniciado sesión con un proveedor externo (Google o Facebook) anteriormente. Por favor, inicia sesión con ese proveedor" : "You have signed in with an external provider in the past (Google or Facebook), please use that method instead",
                    nextAttempt: null,
                }
            }
        }
        return {
            message: locale === "es" ? "Error inesperado. Inténtalo nuevamente" : "Something unexpected happened. Please try again later",
            nextAttempt: null,
        }
    }
}
export async function GoogleSignInAction (prevState: { message: string }, formData: FormData) {
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";
    await signIn("google", { redirect: true, redirectTo: `/${locale}/dashboard`});
    return {
        message: "Google signup"
    }
}
export async function FacebookSignInAction (prevState: { message: string }, formData: FormData) {
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";
    await signIn("facebook", { redirect: true, redirectTo: `/${locale}/dashboard`});
    return {
        message: "Facebook signup"
    }
}