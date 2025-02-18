"use client"
import { useActionState, useEffect, useState } from "react";
import { confirmEmailAction } from "@/app/[lang]/signup/actions";
import { ActionButton } from "../atoms/atom-button";
import { useParams } from "next/navigation";
import { Button, CircularProgress, Input } from "@heroui/react";
import { sendEmailConfirmation } from "@/app/lib/utils";

export default function ConfirmEmail ({ email, name }: {
    email: string,
    name: string
}) {
    const [ confirmState, confirmAction, pending ] = useActionState(confirmEmailAction, { ok: false, message: '' });
    const [ windowReady, setWindowReady ] = useState<boolean>(false);
    const [ time, setTime ] = useState<number>(60);
    const params = useParams();
    const { lang } = params;
    
    useEffect(() => {
        if (window) {
            setWindowReady(true);
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(v => Math.max(0, v - 1));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!windowReady) {
        return <CircularProgress aria-label={ lang === "es" ? "Cargando..." : "Loading..."} color="warning" />
    }

    return (
        <fieldset className="w-full sm:w-[400px] p-3">
            <h3 className="m-2">{ lang === "es" ? 
                "Hemos enviado un correo electrónico que contiene un código, por favor ingresalo aquí para verificar tu cuenta. Recuerda checar la carpeta de 'Spam' si no ves el e-mail en tu Bandeja de Entrada." : 
                "We've sent you an e-mail with a code, please type it here to verify your account. Remember to check your 'Junk' folder in case you don't see the confirmation e-mail in your Inbox." }
            </h3>

            <Input 
            minLength={6}
            maxLength={6}
            name="confirmation-token"
            isRequired
            isClearable
            variant="flat"
            radius="md"
            size="lg"
            validate={() => {
                if (!confirmState.ok) {
                    return confirmState.message;
                }
            }}/>

            <div className="w-full flex flex-row justify-center items-center mt-2 mb-2">
                <CircularProgress 
                color="danger"
                showValueLabel={true} 
                formatOptions={{ style: "unit", unit: "second" }}
                size="lg"
                value={time}
                maxValue={60}/>
            </div>
            

            <ActionButton 
            type="submit"
            action="confirm_email" 
            form="register" 
            text={ lang === "es" ? "Confirmar" : "Confirm" } 
            formaction={ confirmAction } 
            disabled={ pending }
            isLoading={ pending }
            />
            <Button
            isDisabled={ time > 0 ? true : false } 
            onPress={async () => {
                setTime(60);
                await sendEmailConfirmation(email, name);
            }}>{ lang === "es" ? "Re-enviar código" : "Request a new token" }</Button>

        </fieldset>
    )
}