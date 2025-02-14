"use client"
import { Button } from "@heroui/react";
import { signIn } from "next-auth/react";
import { useParams } from "next/navigation";
import { LogoGoogle } from "geist-icons";

export default function GoogleSignIn () {
    const params = useParams();
    const { lang } = params;

    return (
        <Button onPress={() => signIn("google", { redirect: true, redirectTo: `/${lang}/dashboard`})}
        className="bg-white text-black shadow-md font-medium m-1 w-full text-md"
        endContent={<LogoGoogle />}>
            { lang === "es" ? "Continúa con Google" : "Signin with Google" }
        </Button>
    )
}