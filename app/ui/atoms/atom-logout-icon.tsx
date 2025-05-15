"use client"
import { SignoutAction } from "@/app/[lang]/actions"
import { Button } from "@heroui/react"
import { useParams } from "next/navigation"
import { useActionState } from "react"
import { Logout } from "../icons"

export default function SignOutButton () {
    const params = useParams();
    const lang = params.lang;

    const [ state, action, pending ] = useActionState(SignoutAction, { message: "" })
    return <form action={ action }>
        <Button
        type="submit"
        variant="ghost"
        isDisabled={ pending }
        isLoading={ pending }
        style={{
            textDecoration: "none"
        }}
        endContent={ <Logout /> }>
            { lang === "es" ? "Cerrar sesión" : "Sign out"}
        </Button>
    </form>
}