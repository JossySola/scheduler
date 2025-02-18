"use client"
import { useParams } from "next/navigation";
import { PrimaryButtonAsLink } from "./atom-button";

export default function SignUpButton () {
    const params = useParams();
    const { lang } = params;

    return (
        <PrimaryButtonAsLink link={`/${lang}/signup`}>
            { lang === "es" ? "Regístrate" : "Sign Up" }
        </PrimaryButtonAsLink>
    )
}