"use client"
import { validateAction } from "@/app/[lang]/signup/actions";
import { SetStateAction, useActionState, useEffect } from "react";
import { ActionButton } from "./atom-button";

export default function FormButtonValidation ({ text, setValidated, endContent }: { 
    text: string,
    setValidated: React.Dispatch<SetStateAction<boolean>>, 
    endContent?: React.JSX.Element 
    }) {
    const [ nextState, nextAction, pending ] = useActionState(validateAction, { message: '', passes: false, descriptive: []})

    useEffect(() => {
        if (nextState.passes) {
            setValidated(true);
        }
    }, [nextState]);

    return (
        <>
            {
                nextState.descriptive?.map((description, index) => {
                    if (description) {
                        if (description.error) {
                            return <p key={index} className="text-danger">{description.error.issues[0].message}</p>
                        }
                    }
                    return <p key={index} className="text-red-500">{nextState.message}</p>;
                })
            }
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