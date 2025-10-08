"use client"
import { useParams } from "next/navigation";
import { Button, Link } from "@heroui/react";

export default function SignUpButton () {
    const params = useParams();
    const { lang } = params;

    return (
        <Button
        as={Link}
        className="primary-button"
        href={`/${lang}/signup`}>
            { lang === "es" ? "Regístrate" : "Sign Up" }
        </Button>
    )
}