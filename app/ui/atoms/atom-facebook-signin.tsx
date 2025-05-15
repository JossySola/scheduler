"use client"
import { Button } from "@heroui/react";
import { LogoFacebook } from "geist-icons";
import { useActionState } from "react";
import { FacebookSignInAction } from "@/app/[lang]/login/actions";

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
            className="bg-white border-1 border-black text-black shadow-md font-medium m-1 w-full text-md" 
            endContent={<LogoFacebook color="#0866ff"/>}
            >
                { lang === "es" ? "Continúa con Facebook" : "Signin with Facebook" }
            </Button>
        </form>
    )
}