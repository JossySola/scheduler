"use client"
import { validateAction } from "@/app/[lang]/signup/actions";
import { SetStateAction, useActionState, useEffect } from "react";
import { ActionButton } from "./atom-button";

export default function FormButtonValidation ({ text, setValidated, endContent }: { 
    text: string,
    setValidated: React.Dispatch<SetStateAction<boolean>>, 
    endContent?: React.JSX.Element 
    }) {
    const [ nextState, nextAction, pending ] = useActionState(validateAction, { message: '', ok: false })

    useEffect(() => {
        if (nextState.ok) {
            setValidated(true);
        }
    }, [nextState]);

    return (
        <>
            <p className="text-danger">{ nextState.message }</p>
            <ActionButton
            type="submit"
            form="register"
            formAction={nextAction} 
            disabled={pending}
            loading={pending}
            endContent={endContent}>
                { text }
            </ActionButton>
        </>
    )
}