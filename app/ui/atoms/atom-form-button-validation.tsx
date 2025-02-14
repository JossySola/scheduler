"use client"
import { validateAction } from "@/app/[lang]/signup/actions";
import { SetStateAction, useActionState, useEffect } from "react";
import { ActionButton } from "./atom-button";

export default function FormButtonValidation ({
    text,
    formName,
    setValidated
} : { text: string, formName: string, setValidated: React.Dispatch<SetStateAction<boolean>> }) {
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
                            return <p key={index}>{description.error.issues[0].message}</p>
                        }
                    }
                    return <p key={index}>{nextState.message}</p>;
                })
            }
            <ActionButton text={text} type="submit" action="signup_registration" form={formName} formaction={nextAction} disabled={pending}/>
        </>
    )
}