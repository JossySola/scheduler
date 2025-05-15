"use client"
import { useActionState, useEffect, useState } from "react";
import { ActionButton } from "../atoms/atom-button";
import Password from "../atoms/atom-password";
import Link from "next/link";
import { Link as HeroLink } from "@heroui/react";
import { LogInAction } from "@/app/[lang]/login/actions";
import CountdownTimer from "../atoms/atom-timer-attempt";
import { Button, Form, Input } from "@heroui/react";

export default function LogIn ({ lang }: {
    lang: string,
}) {
    // Handles Form Submission with Server Action.
    const [ loginState, loginAction, pending ] = useActionState(LogInAction, { message: "", nextAttempt: null });
    // Stores timestamp for failed password attempts.
    const [ timestamp, setTimestamp ] = useState<string>("");

    useEffect(() => {
        if (loginState.nextAttempt !== null) {
            setTimestamp(loginState.nextAttempt.toString());
        }
    }, [loginState.nextAttempt])

    return (
        <section className="w-full p-3 sm:w-[400px] flex flex-col justify-center items-center pt-5">
            <h2 className="tracking-tight">{ lang === "es" ? "Iniciar sesión" : "Login" }</h2>
            <Form action={loginAction} className="w-full flex-col items-center">
                <Input
                isRequired
                isClearable
                radius="sm"
                size="lg"
                variant="bordered"
                name="username"
                type="text"
                autoComplete="email"
                label={ lang === "es" ? "Correo electrónico o nombre de usuario " : "E-mail or username " } 
                labelPlacement="outside" />

                <Password />

                <p aria-live="polite" className="text-danger">{loginState.message}</p>

                <CountdownTimer nextAttempt={timestamp} />
                <ActionButton disabled={pending} loading={pending} type="submit" className="w-full sm:w-full">
                    { lang === "es" ? "Iniciar sesión" : "Login"}
                </ActionButton>
            </Form>
            
            <Button
            as={HeroLink}
            href={`/${lang}/recover`}
            style={{
                textDecoration: "none"
            }}
            className="w-full m-1 bg-transparent border-2">
            { lang === "es" ? "Restaurar contraseña" : "Reset password" }
            </Button>

            <p className="text-sm text-[#a1a1aa] m-2">
                { lang === "es" ? "Si aún no tienes cuenta, " : "If you don't have an account yet, " }
                <Link href={`/${lang}/signup`}>{ lang === "es" ? "Regístrate" : "Sign up" }</Link>
            </p>
        </section>
    )
}