"use client"
import { validateAction } from "@/app/[lang]/signup/actions";
import { SetStateAction, useActionState, useEffect } from "react";
import { Button } from "@heroui/react";

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
            <Button
            type="submit"
            form="register"
            className="action-button"
            onSubmit={data => {
                const form = data.currentTarget.form;
                if (form) {
                    const formData = new FormData(form); 
                    nextAction(formData);
                }
            }}
            isDisabled={pending}
            isLoading={pending}
            endContent={endContent}>
                { text }
            </Button>
        </>
    )
}