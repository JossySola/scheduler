"use client"
import { Button, Link } from "@heroui/react";
import { useParams } from "next/navigation";

export default function SignUpButton () {
    const params = useParams();
    const { lang } = params;

    return (
        <Button
        className="bg-gradient-to-tr from-violet-600 to-blue-500 text-white shadow-lg"
        as={Link}
        href={`/${lang}/signup`}>
            { lang === "es" ? "Regístrate" : "Sign Up" }
        </Button>
    )
}