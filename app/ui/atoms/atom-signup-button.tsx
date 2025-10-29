"use client"
import { redirect, useParams } from "next/navigation";
import { Button } from "@heroui/react";

export default function SignUpButton () {
    const params = useParams();
    const { lang } = params;

    return (
        <Button
        aria-label={ lang === "es" ? "Regístrate" : "Sign Up"}
        className="primary-button"
        onPress={() => redirect(`/${lang}/signup`)}>
            { lang === "es" ? "Regístrate" : "Sign Up" }
        </Button>
    )
}