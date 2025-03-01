"use client"
import { Button } from "@heroui/react";
import { signIn } from "next-auth/react";
import { LogoFacebook } from "geist-icons";

export default function FacebookSignIn ({ lang }: {
    lang: "en" | "es"
}) {

    return (
        <Button onPress={() => signIn("facebook", { redirect: true, redirectTo: `/${lang}/dashboard` })}
        className="bg-white text-black shadow-md font-medium m-1 w-full text-md" 
        endContent={<LogoFacebook color="#0866ff"/>}
        >
            { lang === "es" ? "Continúa con Facebook" : "Signin with Facebook" }
        </Button>
    )
}