"use client"
import { signOut } from "next-auth/react"
import { useParams } from "next/navigation"

export default function LogOutButton () {
    const params = useParams();
    const { lang } = params;

    return (
        <form action={async () => {
            signOut({
                redirect: true,
                redirectTo: `/${lang}/login`
            })
        }}>
            <button type="submit">{ lang === "es" ? "Cerrar sesión" : "Sign out"}</button>
        </form>
    )
}