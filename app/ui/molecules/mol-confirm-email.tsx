"use client"
import { useActionState, useEffect, useState } from "react";
import { confirmEmailAction } from "@/app/[lang]/signup/actions";
import { ActionButton } from "../atoms/atom-button";
import { useParams } from "next/navigation";

export default function ConfirmEmail () {
    const [confirmState, confirmAction, pending] = useActionState(confirmEmailAction, { ok: false, message: ''});
    const [ windowReady, setWindowReady ] = useState<boolean>(false);
    const params = useParams();
    const { lang } = params;
    
    useEffect(() => {
        if (window) {
            setWindowReady(true);
        }
    }, []);

    if (!windowReady) {
        return <p>Loading...</p>
    }

    return (
        <fieldset>
            <h3>{ lang === "es" ? 
                "Hemos enviado un e-mail que contiene un código, por favor ingresalo aquí para verificar tu cuenta. Recuerda checar la carpeta de 'Spam' si no ves el e-mail en tu Bandeja de Entrada." : 
                "We've sent you an e-mail with a code, please type it here to verify your account. Remember to check your 'Junk' folder in case you don't see the confirmation e-mail in your Inbox." }</h3>

            <input minLength={6} maxLength={6} id="confirmation-token" name="confirmation-token" required />
            
            {
                !confirmState.ok ? <p>{confirmState.message}</p> : null
            }
            
            <ActionButton 
                action="confirm_email" 
                form="register" 
                text={ lang === "es" ? "Confirmar" : "Confirm" } 
                formaction={ confirmAction } 
                disabled={ pending }
                />
        </fieldset>
    )
}