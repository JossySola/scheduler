"use client"
import { useActionState, useEffect, useState } from "react";
import { SubmitButton } from "../atoms/atom-button";
import Password from "../atoms/atom-password";
import Link from "next/link";
import { LogInAction } from "@/app/[lang]/login/actions";
import PasswordResetButton from "../atoms/atom-button-password-reset";
import CountdownTimer from "../atoms/atom-timer-attempt";
import { Form, Input } from "@heroui/react";

export default function LogIn ({ lang }: {
    lang: string,
}) {
    const [ loginState, loginAction, pending ] = useActionState(LogInAction, { message: "" });
    const [ message, setMessage ] = useState<string>("");
    const [ timestamp, setTimestamp ] = useState<string>("");

    useEffect(() => {
        const split = loginState.message.split('/');
        if (split) {
            split.forEach((text, index) => {
                if (index === 0 && typeof text === "string") {
                    setMessage(text)
                }
                if (typeof text === "string" && text.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
                    setTimestamp(text);
                }
            })
        }
    }, [loginState]);
    
    
    return (
        <section className="w-full p-3 sm:w-[400px] flex flex-col justify-center items-center">
            <h2 className="text-2xl font-semibold tracking-tight">{ lang === "es" ? "Iniciar sesión" : "Login" }</h2>
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
                label={ lang === "es" ? "Correo electrónico o nombre de usuario" : "E-mail or username" } 
                labelPlacement="outside" />
                <Password />
                <p aria-live="polite">{message}</p>
                <CountdownTimer nextAttempt={timestamp} />
                <SubmitButton className="w-full m-1" text={ lang === "es" ? "Iniciar sesión" : "Login"} disabled={pending} />
            </Form>
            <PasswordResetButton className="w-full m-1"/>
            <p className="text-sm text-[#a1a1aa] m-2">
                { lang === "es" ? "Si aún no tienes cuenta, " : "If you don't have an account yet, " }
                <Link href={"/signup"}>{ lang === "es" ? "Regístrate" : "Signup" }</Link>
            </p>
        </section>
    )
}