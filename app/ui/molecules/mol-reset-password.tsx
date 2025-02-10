"use client"
import { SubmitButton } from "@/app/ui/atoms/atom-button";
import { useActionState, useState } from "react";
import { passwordResetAction } from "../../[lang]/reset/actions";

export default function ResetPassword({ token }: {
    token: string
}) {
const [ resetState, resetAction, pending ] = useActionState(passwordResetAction, { message: "" });
const [ reveal, setReveal ] = useState<boolean>(false);

    return (
        <form action={resetAction}>
            <input type="text" name="token" value={token} readOnly hidden />
            <input type={reveal ? "text" : "password"} name="password" id="password" autoComplete="new-password" required min={8}/>
            <input type={reveal ? "text" : "password"} name="confirm-password" id="confirm-password" autoComplete="new-password" required min={8}/>
            <button 
                type="button" 
                onClick={() => {
                    setReveal(!reveal);
            }}>Reveal</button>
            
            <p aria-live="polite">{resetState.message}</p>
            <SubmitButton text="Reset password" disabled={pending} />
        </form>
    )
}