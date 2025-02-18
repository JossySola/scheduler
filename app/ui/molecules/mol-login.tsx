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
    const [ loginState, loginAction, pending ] = useActionState(LogInAction, { message: "" });
    // Handles message display from errors.
    const [ message, setMessage ] = useState<string>("");
    // Stores timestamp for failed password attempts.
    const [ timestamp, setTimestamp ] = useState<string>("");

    useEffect(() => {
        // The Server Action returns an Object with a -message- property. When the password attempt fails,
        // it retrieves the timestamp registered in the database for the last password attempt and
        // concatenates it in the message string separated with a slash.
        const split = loginState.message.split('/');
        // This splits the message on each encountered slash and return the substrings as an Array.
        if (split) {
            // If -split- has a returned value, begin iteration...
            split.forEach((text, index) => {
                // If the position is at index 0 and the value is of type String.
                if (index === 0 && typeof text === "string") {
                    // Store the value in Message.
                    setMessage(text)
                }
                // If the position is at any index and the value matches the Regex for a timestamp
                // in this format: 2025-02-16T12:34:56.789Z
                if (typeof text === "string" && text.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
                    setTimestamp(text);
                }
            })
        }
        // Executes this Effect hook every time the State from the Server Action changes.
    }, [loginState]);
    
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

                <p aria-live="polite" className="text-danger">{message}</p>

                <CountdownTimer nextAttempt={timestamp} />
                <ActionButton disabled={pending} type="submit" className="w-full sm:w-full">
                    { lang === "es" ? "Iniciar sesión" : "Login"}
                </ActionButton>
            </Form>
            
            <Button
            as={HeroLink}
            href={`/${lang}/recover`}
            className="w-full m-1 bg-transparent border-2">
            { lang === "es" ? "Restaurar contraseña" : "Reset password" }
            </Button>

            <p className="text-sm text-[#a1a1aa] m-2">
                { lang === "es" ? "Si aún no tienes cuenta, " : "If you don't have an account yet, " }
                <Link href={`/${lang}/signup`}>{ lang === "es" ? "Regístrate" : "Signup" }</Link>
            </p>
        </section>
    )
}