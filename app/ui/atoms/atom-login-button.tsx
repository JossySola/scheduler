"use client"
import { Button, Link } from "@heroui/react";
import { useParams } from "next/navigation"
import { SignIn } from "geist-icons";

export default function LogInButton () {
    const params = useParams();
    const { lang } = params;

    return (
        <Button
        className="bg-transparent border-2"
        as={Link}
        endContent={<SignIn />}
        href={`/${lang}/login`}>
            { lang === "es" ? "Iniciar sesión" : "Log in"}
        </Button>
    )
}