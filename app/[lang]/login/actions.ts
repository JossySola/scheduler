"use server"
import "server-only";
import { signIn } from "@/auth";
import { AuthError } from "@auth/core/errors";
import { headers } from "next/headers";

export async function LogInAction (prevState: { message: string, nextAttempt: number | null }, formData: FormData) {
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";

    const username = formData.get("username");
    const password = formData.get("password");

    if (!formData || !username || !password) {
        return {
            message: locale === "es" ? "Por favor, llena todos los campos" : "Please, fill out both fields",
            nextAttempt: null
        }
    }
    
    try {
        await signIn("credentials", {
            username,
            password,
            redirect: true,
            redirectTo: `/${locale}/dashboard`
        })
        return {
            message: "Logged in",
            nextAttempt: null
        }
    } catch (error) {
        if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
            if (error instanceof AuthError) {
                if (error.cause?.next_attempt) {
                    return {
                        message: locale === "es" ? "Información inválida" : "Invalid credentials",
                        nextAttempt: error.cause.next_attempt as number
                    };
                }
                if (typeof error.cause === "number") {
                    if (error.cause === 404) {
                        return {
                            message: locale === "es" ? "Usuario no existe" : "User not found",
                            nextAttempt: null
                        }
                    } else if (error.cause === 409) {
                        return {
                            message: locale === "es" ? "Registro incorrecto. Favor de reportar error" : "Bad registry. Please report this specific issue",
                            nextAttempt: null
                        }
                    } else if (error.cause === 500) {
                        return {
                            message: locale === "es" ? "Error interno" : "Internal Error",
                            nextAttempt: null
                        }
                    }

                }
                console.log(error.cause)
                return {
                    message: locale === "es" ? "Este correo electrónico está registrado con un proveedor externo, usa ese método para iniciar sesión." : "This e-mail is registered with an external provider, use that instead.",
                    nextAttempt: null
                }
            } else if (error instanceof Error) {
                return {
                    message: locale === "es" ? "Error inesperado. Inténtalo nuevamente" : "Something unexpected happened. Please try again later",
                    nextAttempt: null
                }
            }
        }
        throw error;
    }
}