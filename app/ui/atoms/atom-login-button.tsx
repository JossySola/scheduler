"use client"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function LogInButton () {
    const params = useParams();
    const { lang } = params;

    return (
        <Link href={`/${lang}/login`}>{ lang === "es" ? "Iniciar sesión" : "Log in"}</Link>
    )
}