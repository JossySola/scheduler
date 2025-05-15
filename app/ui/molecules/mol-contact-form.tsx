"use client"
import { addToast, Button, Form, Input, Select, SelectItem, Textarea } from "@heroui/react"
import { useActionState, useEffect } from "react"
import contactAction from "@/app/[lang]/contact/actions"

export default function ContactForm ({ lang }: {
    lang: "es" | "en"
}) {
    const [ contactState, formAction, contactPending ] = useActionState(contactAction, { ok: false, message: "" })
    useEffect(() => {
        if (contactState && contactState.message) {
            addToast({
                title: contactState.message,
                color: contactState.ok ? "success" : "danger",
            })
        }
    }, [contactState]);
    return <Form className="w-full p-5 sm:w-[400px] flex flex-col items-center">
        <Select size="lg" label={ lang === "es" ? "¿Cuál es el asunto? " : "What's the subject? " } name="subject" isRequired>
            <SelectItem key="feedback">Feedback</SelectItem>
            <SelectItem key="bug issue">{ lang === "es" ? "Reportar problema técnico" : "Report bug / error" }</SelectItem>
            <SelectItem key="account inquiry">{ lang === "es" ? "Consulta sobre la cuenta" : "Account Inquiry" }</SelectItem>
        </Select>
        <Input isRequired isClearable size="lg" type="name" name="name" label={ lang === "es" ? "Nombre " : "Name " } />
        <Input isRequired isClearable size="lg" type="email" name="email" label={ lang === "es" ? "Correo electrónico " : "E-mail " } />
        <Textarea isRequired name="message" label={ lang === "es" ? "Mensaje " : "Message " }  placeholder={ lang === "es" ? "Por favor escribe un mensaje descriptivo sobre tu consulta." : "Provide a descriptive message about your inquiry." } />
        <Button 
        size="lg" 
        type="submit" 
        isLoading={ contactPending } 
        isDisabled={ contactPending } 
        className="bg-black text-white dark:bg-white dark:text-black m-5" 
        formAction={ formAction }>
            { lang === "es" ? "Enviar" : "Send" }
        </Button>
    </Form>
}