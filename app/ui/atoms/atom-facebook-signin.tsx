"use client"
import { Button } from "@heroui/react";
import { useActionState } from "react";
import { FacebookSignInAction } from "@/app/[lang]/login/actions";
import { LogoFacebook } from "../icons";

export default function FacebookSignIn ({ lang }: {
    lang: "en" | "es"
}) {
    const [ state, action, pending ] = useActionState(FacebookSignInAction, { message: "" });
    return (
        <form action={ action } className="w-full">
            <Button 
            type="submit"
            isLoading={ pending }
            isDisabled={ pending }
            className="provider-button" 
            endContent={<LogoFacebook />}
            >
                { lang === "es" ? "Continúa con Facebook" : "Continue with Facebook" }
            </Button>
        </form>
    )
}