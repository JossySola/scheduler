"use client"
import { Button, Link } from "@heroui/react";
import { useParams } from "next/navigation";
import { SignIn } from "../icons";

export default function LogInButton () {
    const params = useParams();
    const { lang } = params;

    return (
        <Button
        aria-label={ lang === "es" ? "Iniciar sesión" : "Log in"}
        className="bg-transparent border-2 dark:text-white"
        style={{
            textDecoration: "none"
        }}
        as={Link}
        endContent={<SignIn />}
        href={`/${lang}/login`}>
            { lang === "es" ? "Iniciar sesión" : "Log in"}
        </Button>
    )
}