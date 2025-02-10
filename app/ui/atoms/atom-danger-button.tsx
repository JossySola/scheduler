"use client"
import { useActionState, useEffect, useRef, useState } from "react"
import Dialog from "./atom-dialog";
import { Button, SubmitButton } from "./atom-button";
import { DeleteAccountAction } from "@/app/[lang]/profile/settings/actions";
import { useParams } from "next/navigation";

export default function DangerButton () {
    const dialogElement = useRef<HTMLDialogElement | null>(null);
    const [ deleteState, deleteAction, pending] = useActionState(DeleteAccountAction, { message: "" });
    const [refAvailable, setRefAvailable ] = useState<boolean>(false);
    const params = useParams();
    const { lang } = params;

    useEffect(() => {
        if (dialogElement.current) {
            setRefAvailable(true);
        }
    }, [refAvailable])

    const handleDialog = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (dialogElement.current) {
            dialogElement.current.showModal();
        }
    }
    
    return (
        <>
        <Dialog ref={dialogElement}>
            <form action={deleteAction}>
                <label autoFocus>
                    { lang === "es" ? "¡Cuidado! Confirma esta acción ya que ésta no será reversible:" : "Warning! Confirm this action as this will be irreversible:" }
                </label>
                <input type="password" name="password" autoComplete="current-password" required/>
                <p aria-live="polite">{deleteState && deleteState.message}</p>
                <SubmitButton text="Confirm" disabled={pending} />
            </form>
        </Dialog>
        {
            refAvailable && <Button text={ lang === "es" ? "Eliminar cuenta" : "Delete account"} callback={handleDialog} />
        }
        </>
    )
}