"use client"
import { Button } from "@heroui/react";
import { useActionState } from "react";
import { GoogleSignInAction } from "@/app/[lang]/login/actions";
import { LogoGoogle } from "../icons";

export default function GoogleSignIn ({ lang }: {
    lang: "en" | "es"
}) {
    const [ state, action, pending ] = useActionState(GoogleSignInAction, { message: "" });
    return (
        <form action= { action } className="w-full">
            <Button 
            type="submit"
            aria-label={ lang === "es" ? "Iniciar sesión con Google" : "Sign in with Google" }
            isLoading={ pending }
            isDisabled={ pending }
            className="provider-button"
            endContent={<LogoGoogle />}>
                { lang === "es" ? "Continúa con Google" : "Continue with Google" }
            </Button>
        </form>
    )
}