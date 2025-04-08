"use client"
import { SignoutAction } from "@/app/[lang]/actions"
import { Button } from "@heroui/react"
import { Logout } from "geist-icons"
import { useActionState } from "react"

export default function SignOutButton ({ lang }: {
    lang: "en" | "es"
}) {
    const [ state, action, pending ] = useActionState(SignoutAction, { message: "" })
    return <form action={ action }>
        <Button
        type="submit"
        variant="ghost"
        isDisabled={ pending }
        isLoading={ pending }
        endContent={ <Logout /> }>
            { lang === "es" ? "Cerrar sesión" : "Sign out"}
        </Button>
    </form>
}