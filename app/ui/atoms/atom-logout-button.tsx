"use client"
import { signOut } from "next-auth/react"
import { useParams } from "next/navigation"
import { Logout } from "geist-icons";
import { Button } from "@heroui/react";

export default function LogOutButton () {
    const params = useParams();
    const { lang } = params;

    return (
        <Button 
        variant="ghost"
        endContent={<Logout />} 
        onPress={() => signOut({
            redirect: true,
            redirectTo: `/${lang}/login`
        })}>
            { lang === "es" ? "Cerrar sesión" : "Sign out"}
        </Button>
    )
}