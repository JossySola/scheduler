"use client"
import { Button, Link } from "@heroui/react"
import { useParams } from "next/navigation"
import { Home } from "../icons";

export default function HomeAtom() {
    const params = useParams();
    const lang = params.lang;

    return (
        <Button 
        isIconOnly 
        aria-label={ lang === "es" ? "Ir al panel de control" : "Go to dashboard" }
        variant="light"
        as={Link} 
        style={{
            textDecoration: "none"
        }}
        href={`/${lang}/dashboard`}>
            <Home width={25} height={25}/>
        </Button>
    )
}