"use client"
import { Button, Form, Input, Textarea } from "@heroui/react";
import { useParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { getDeviceInfo } from "@/app/lib/utils-client";
import * as z from "zod/v4";
import emailjs from '@emailjs/browser';
import { PaperAirplane, RefreshClockwise } from "@/app/ui/icons";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string },
    reset: () => void,
}) {
    const params = useParams();
    const lang = params.lang;
    const [ state, action, pending ] = useActionState(reportAction, { message: "", ok: false });
    useEffect(() => {
        if (state.ok) {
            reset();
        }
    }, [state.ok]);
    return (
        <section className="w-full h-full flex flex-col justify-center items-center gap-5 text-center p-5">
            <h2>{ lang === "es" ? "Algo inesperado ha ocurrido 😢" : "Something unexpected has happened 😢" }</h2>
            <div className="flex flex-row justify-center items-center gap-3">
                <p>{ lang === "es" ? "Intentar de nuevo" : "Try again" }</p>
                <Button isIconOnly color="primary" aria-label="refresh" onPress={ () => reset() }>
                    <RefreshClockwise />
                </Button>
            </div>
            <Form action={ action } className="w-full p-10 flex flex-col items-center justify-center">
                <Textarea 
                name="description"
                variant="flat"
                size="lg"
                radius="sm"
                placeholder={ lang === "es" ? "Escribe una breve descripción del contexto en el que se ocasionó el error." : "Write a brief description of the context where the error occurred." }
                label={ lang === "es" ? "Descripción del error" : "Error description" } 
                maxRows={ 10 } 
                isClearable />
                
                <input
                readOnly
                hidden
                name="error-name"
                defaultValue={ error.name.toString() }/>
                <input
                readOnly
                hidden
                name="error-message"
                defaultValue={ error.message.toString() }/>
                <input
                readOnly
                hidden
                name="error-stack"
                defaultValue={ error.stack ? error.stack.toString() : "" }/>
                <input
                readOnly
                hidden
                name="device-info"
                defaultValue={ JSON.stringify(getDeviceInfo()) }/>

                <p>{ state.message }</p>
                <Button 
                isDisabled={ pending || state.ok } 
                isLoading={ pending } 
                type="submit"
                className="action-button" 
                endContent={ <PaperAirplane /> }>
                    {
                        state.ok ? 
                        lang === "es" ? "Enviado" : "Sent" :
                        lang === "es" ? "Enviar" : "Send"
                    }
                </Button>
            </Form>
        </section>
    )
}

async function reportAction (previousState: { message: string, ok: boolean }, formData: FormData) {
    
    const rawData = {
        email: formData.get("email"),
        description: formData.get("description"),
        error_name: formData.get("error-name"),
        error_message: formData.get("error-message"),
        error_stack: formData.get("error-stack"),
        device_info: formData.get("device-info"),
    };
    const reportSchema = z.object({
        email: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
        error_name: z.string(),
        error_message: z.string(),
        error_stack: z.string().optional(),
        device_info: z.string(),
      });

    const parseResult = reportSchema.safeParse(rawData);

    if (!parseResult.success) {
        const errorMessage = parseResult.error.issues[0].message;
        return {
            message: `❌ ${errorMessage}`,
            ok: false,
        };
    }
    try {
        emailjs.init({
            publicKey: "htLRA-_MePkeQ6YI8"
        })
        const response = await emailjs.send(
            "service_jhdciyb",
            "template_bo0x1qb",
            parseResult.data,
        )
        return {
            message: "✅",
            ok: true,
        }
    } catch (e) {
        return {
            message: "❌",
            ok: false,
        }
    }
}