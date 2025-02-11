"use client"
import { Button } from "@heroui/react";
import { signIn } from "next-auth/react";
import { useParams } from "next/navigation";
import { LogoFacebook } from "geist-icons";

export default function FacebookSignIn () {
    const params = useParams();
    const { lang } = params;

    return (
        <Button onPress={() => signIn("facebook", { redirect: true, redirectTo: `/${lang}/dashboard` })}
        className="bg-white text-black shadow-md font-semibold m-1 w-full" 
        endContent={<LogoFacebook color="#0866ff"/>}
        >
            { lang === "es" ? "Continúa con Facebook" : "Signin with Facebook" }
        </Button>
    )
}