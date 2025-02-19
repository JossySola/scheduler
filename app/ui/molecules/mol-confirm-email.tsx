"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, CircularProgress, Input } from "@heroui/react";
import { sendEmailConfirmation } from "@/app/lib/utils";

export default function ConfirmEmail ({ email, name, children }: {
    email: string,
    name: string,
    children: React.JSX.Element,
}) {
    const [ time, setTime ] = useState<number>(60);
    const params = useParams();
    const { lang } = params;

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(v => Math.max(0, v - 1));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <fieldset className="w-full sm:w-[400px] p-3">
            { lang === "es" ? 
                <h3 className="m-2">Hemos enviado un correo electrónico que contiene un código, por favor ingresalo aquí para verificar tu cuenta. Recuerda checar la carpeta de <b>Spam</b> si no ves el e-mail en tu <b>Bandeja de Entrada</b>.</h3> : 
                <h3 className="m-2">We've sent you an e-mail with a code, please type it here to verify your account. Remember to check your <b>Junk</b> folder in case you don't see the confirmation e-mail in your <b>Inbox</b>.</h3>    
            }

            <Input 
            minLength={6}
            maxLength={6}
            name="confirmation-token"
            isRequired
            isClearable
            variant="flat"
            radius="md"
            size="lg"/>

            <div className="w-full flex flex-row justify-center items-center mt-2 mb-2">
                <CircularProgress 
                color="danger"
                showValueLabel={true} 
                formatOptions={{ style: "unit", unit: "second" }}
                size="lg"
                value={time}
                maxValue={60}/>
            </div> 
            
            { children }
            
            <Button
            isDisabled={ time > 0 ? true : false } 
            onPress={async () => {
                setTime(60);
                await sendEmailConfirmation(email, name, lang as "en" | "es");
            }}>{ lang === "es" ? "Re-enviar código" : "Request a new token" }</Button>
        </fieldset>
    )
}