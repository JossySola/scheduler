"use client"
import { Button } from "@heroui/react";
import { LogoGoogle } from "geist-icons";
import { useActionState } from "react";
import { GoogleSignInAction } from "@/app/[lang]/login/actions";

export default function GoogleSignIn ({ lang }: {
    lang: "en" | "es"
}) {
    const [ state, action, pending ] = useActionState(GoogleSignInAction, { message: "" });
    return (
        <form action= { action } className="w-full">
            <Button 
            type="submit"
            isLoading={ pending }
            isDisabled={ pending }
            className="border-1 border-black bg-white text-black shadow-md font-medium m-1 w-full text-md"
            endContent={<LogoGoogle />}>
                { lang === "es" ? "Continúa con Google" : "Signin with Google" }
            </Button>
        </form>
    )
}