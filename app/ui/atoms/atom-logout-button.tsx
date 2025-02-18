"use client"
import { signOut } from "next-auth/react"
import { useParams } from "next/navigation"
import { SecondaryButton } from "./atom-button";

export default function LogOutButton () {
    const params = useParams();
    const { lang } = params;

    return (
        <SecondaryButton onPress={() => signOut({
            redirect: true,
            redirectTo: `/${lang}/login`
        })}>
            { lang === "es" ? "Cerrar sesión" : "Sign out"}
        </SecondaryButton>
    )
}