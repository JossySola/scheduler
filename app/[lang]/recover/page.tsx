"use client"

import { ActionButton } from "@/app/ui/atoms/atom-button"
import { Form, Input } from "@heroui/react"
import { useParams } from "next/navigation"
import { useActionState, useEffect, useState } from "react"
import { SendResetEmailAction } from "./actions"

export default function Page() {
    const [ sendState, sendAction, pending ] = useActionState(SendResetEmailAction, { message: "" });
    const [ sent, setSent ] = useState<boolean>(false);
    const params = useParams()
    const { lang } = params;

    useEffect(() => {
        if (sendState && sendState.message) {
            if (sendState.message === "¡Correo enviado!" || sendState.message === "Email sent!") {
                setSent(true);
            }
        }
    }, [sendState])

    return (
        <section className="w-full flex flex-col justify-center items-center p-5">
        <h2>{ lang === "es" ? "Recuperación de contraseña" : "Password Recovery" }</h2>
        {
            lang === "es" ? 
            <p className="sm:w-[500px] m-5">Enviarémos un correo electrónico con un enlace. Por favor, sigue las instrucciones que encontrarás en el mensaje. Recuerda checar la carpeta de <b>Spam</b> en caso de no ver el correo en la <b>Bandeja de Entrada</b> o espera unos minutos.</p> :
            <p className="sm:w-[500px] m-5">We'll send you an e-mail with a link. Please, follow the instructions contained in the e-mail. Remember to check the <b>Spam</b> folder in case you don't see the e-mail in your <b>Inbox</b> or wait a few minutes.</p>
        }
        <Form className="flex flex-col justify-center items-center" action={sendAction}>
            <Input 
            isRequired
            name="email"
            type="email"
            autoComplete="off"
            label={ lang === "es" ? "Ingresa tu correo electrónico " : "Enter your e-mail " }
            labelPlacement="outside"
            placeholder="name@domain.com"
            className="w-full sm:w-[400px]"/>
            <p aria-live="polite" className="text-danger">{ sendState.message }</p>
            <ActionButton type="submit" loading={pending} disabled={pending || sent}>
                { lang === "es" ? "Recuperar contraseña" : "Recover password" }
            </ActionButton>
        </Form>
        </section>
    )
}