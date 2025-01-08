"use client"
import { useActionState, useEffect, useState } from "react";
import { confirmEmailAction } from "@/app/(routes)/signup/actions";
import { ActionButton } from "../atoms/atom-button";

export default function ConfirmEmail () {
    const [confirmState, confirmAction, pending] = useActionState(confirmEmailAction, { ok: false, message: ''});
    const [ windowReady, setWindowReady ] = useState<boolean>(false);

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
            <h3>We've sent you an e-mail with a code, please type it here to verify your account</h3>
            <h4>Hemos enviado un e-mail que contiene un código, por favor ingresalo aquí para verificar tu cuenta</h4>

            <input minLength={6} maxLength={6} id="confirmation-token" name="confirmation-token" required />
            <ActionButton 
                action="confirm_email" 
                form="register" 
                text="Confirm" 
                formaction={ confirmAction } 
                disabled={ pending } 
                />
        </fieldset>
    )
}