"use server"
import "server-only";
import { signIn } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

type RouteError = {
  type: 'CallbackRouteError';
  kind: 'error';
  cause: {
    err: {
      message: string;
      cause: number;
      name: string;
      type: string;
      kind: string;
    };
    provider: string;
    next_attempt?: number;
  };
};
type AttemptObject = { next_attempt: number | null }
export async function LogInAction (prevState: { message: string, nextAttempt: number | null } | undefined, formData: FormData) {
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
            redirectTo: `${process.env.NEXT_PUBLIC_ORIGIN}/${locale}/dashboard`,
        })
    } catch (err) {
        if (isRedirectError(err)) {
            redirect(`${process.env.NEXT_PUBLIC_ORIGIN}/${locale}/dashboard`);
        }
        if (err && typeof err === "object") {
            if ((err as RouteError).type && (err as RouteError).type === "CallbackRouteError") {
                const error = (err as RouteError).cause.err;
                const cause = error.cause;
                if (typeof cause === "number") {
                    switch (cause) {
                        case 400: {
                            return {
                                message: locale === "es" ? "Por favor, llene todos los campos" : "Please fill out all the fields",
                                nextAttempt: null,
                            }
                        }
                        case 404: {
                            return {
                                message: locale === "es" ? "Información inválida 🤔" : "Invalid credentials 🤔",
                                nextAttempt: null,
                            }
                        }
                        case 402: {
                            return {
                                message: locale === "es" ? "Has iniciado sesión con un proveedor externo (Google o Facebook) anteriormente. Por favor, inicia sesión con ese proveedor" : "You have signed in with an external provider in the past (Google or Facebook), please use that method instead",
                                nextAttempt: null,
                            }
                        }
                        case 409: {
                            return {
                                message: locale === "es" ? "Hay un error en tu registro, por favor contáctanos" : "There is an error in your record, please contact us",
                                nextAttempt: null,
                            }
                        }
                        case 500: {
                            return {
                                message: locale === "es" ? "Error inesperado. Inténtalo nuevamente" : "Something unexpected happened. Please try again later",
                                nextAttempt: null,
                            }
                        }
                        default: {
                            return {
                                message: locale === "es" ? "Error inesperado. Inténtalo nuevamente" : "Something unexpected happened. Please try again later",
                                nextAttempt: null,
                            }
                        }
                    }
                    
                } else if (cause && typeof cause !== "number" && (cause as AttemptObject).next_attempt) {
                    return {
                        message: locale === "es" ? "Hay uno o más intentos de inicio de sesión fallidos, inténtalo nuevamente después del tiempo asignado" : "There is one or more sign in attempts, please try again after the assigned clock",
                        nextAttempt: (cause as AttemptObject).next_attempt,
                    }
                }
            }
        } else if (err instanceof Error) {
            return {
                message: locale === "es" ? "Error desconocido, inténtalo más tarde o contáctanos" : "Unknown error, please try again later or contact us",
                nextAttempt: null,
            }
        }
        return {
            message: "",
            nextAttempt: null,
        }
    }
}
export async function GoogleSignInAction (prevState: { message: string }, formData: FormData) {
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";
    await signIn("google", { redirect: true, redirectTo: `${process.env.NEXT_PUBLIC_ORIGIN}/${locale}/dashboard`});
    return {
        message: "Google signup"
    }
}
export async function FacebookSignInAction (prevState: { message: string }, formData: FormData) {
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";
    await signIn("facebook", { redirect: true, redirectTo: `${process.env.NEXT_PUBLIC_ORIGIN}/${locale}/dashboard`});
    return {
        message: "Facebook signup"
    }
}