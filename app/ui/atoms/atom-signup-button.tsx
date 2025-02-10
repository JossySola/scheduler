"use client"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function SignUpButton () {
    const params = useParams();
    const { lang } = params;

    return (
        <Link href={`${lang}/signup`}>{ lang === "es" ? "Regístrate" : "Sign Up" }</Link>
    )
}