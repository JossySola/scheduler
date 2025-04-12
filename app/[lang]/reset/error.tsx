"use client"
import { Button, Form, Input, Textarea } from "@heroui/react";
import { PaperAirplane, RefreshClockwise } from "geist-icons";
import { useParams } from "next/navigation";
import { useActionState } from "react";
import { ActionButton } from "@/app/ui/atoms/atom-button";
import { getDeviceInfo } from "@/app/lib/utils-client";
import { z } from "zod";
import emailjs from '@emailjs/browser';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string },
    reset: () => void,
}) {
    const params = useParams();
    const lang = params.lang;
    const [ state, action, pending ] = useActionState(reportAction, { message: "" }); 

    return (
        <section className="w-full h-full flex flex-col justify-center items-center gap-5">
            <h2>{ lang === "es" ? "Algo inesperado ha ocurrido 😢" : "Something unexpected has happened 😢" }</h2>
            <p>{ lang === "es" ? "Intentar de nuevo" : "Try again" }</p>
            <Button isIconOnly color="primary" aria-label="refresh" onPress={ () => reset() }>
                <RefreshClockwise />
            </Button>
            
            <Form action={ action }>
                <Input radius="sm" size="lg" name="email" isClearable />
                <Textarea 
                name="description"
                variant="flat"
                radius="sm"
                placeholder={ lang === "es" ? "Escribe una breve descripción del contexto en el que se ocasionó el error." : "Write a brief description of the context where the error occurred." }
                label={ lang === "es" ? "Descripción del error" : "Error description" } 
                maxRows={ 10 } 
                isClearable />
                <p>{ state.message }</p>
                <ActionButton disabled={ pending } loading={ pending } type="submit" endContent={ <PaperAirplane /> }>
                    { lang === "es" ? "Enviar" : "Send" }
                </ActionButton>
                <Textarea 
                variant="bordered"
                radius="sm"
                isDisabled 
                readOnly
                name="error-name"
                defaultValue={ error.name }/>
                <Textarea 
                variant="bordered"
                radius="sm"
                isDisabled 
                readOnly
                name="error-message"
                defaultValue={ error.message }/>
                <Textarea 
                variant="bordered"
                radius="sm"
                isDisabled 
                readOnly
                name="error-stack"
                defaultValue={ error.stack }/>
                <Textarea 
                variant="bordered"
                radius="sm"
                isDisabled 
                readOnly
                name="device-info"
                defaultValue={ JSON.stringify(getDeviceInfo()) }/>
            </Form>
        </section>
    )
}

async function reportAction (previousState: { message: string }, formData: FormData) {
    "use client"
    const rawData = {
        email: formData.get("email"),
        description: formData.get("description"),
        error_name: formData.get("error-name"),
        error_message: formData.get("error-message"),
        error_stack: formData.get("error-stack"),
        device_info: formData.get("device-info"),
    };
    const reportSchema = z.object({
        email: z.string().email("Invalid email address").optional(),
        description: z.string().optional(),
        error_name: z.string(),
        error_message: z.string(),
        error_stack: z.string().optional(),
        device_info: z.string(),
      });

    const parseResult = reportSchema.safeParse(rawData);

    if (!parseResult.success) {
        const errorMessages = parseResult.error.errors.map(e => e.message).join("\n");
        return {
            message: `❌ ${errorMessages}`,
        };
    }
    try {
        emailjs.init({
            publicKey: process.env.NEXT_PUBLIC_EMAILJS_KEY
        })
        await emailjs.send(
            process.env.NEXT_EMAILJS_ICLOUD_SERVICE!,
            process.env.NEXT_EMAILJS_TEMPLATE!,
            parseResult.data,
            process.env.NEXT_EMAILJS_KEY
        )
        return {
            message: "✅"
        }
    } catch (e) {
        return {
            message: "❌"
        }
    }
}