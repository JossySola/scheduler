'use client'
import { LogInAction } from "@/app/(routes)/login/actions";
import { SubmitButton } from "../atoms/atom-button";
import Password from "../atoms/atom-password";
import { useActionState } from "react";

export default function LogIn () {
    const [state, formAction, pending] = useActionState(LogInAction, { message: '' });

    return (
        <form action={formAction}>
            <label>
                E-mail or username
                <input name="username" type="text" />
            </label>
            <label>
                Password
                <Password />
            </label>
            <SubmitButton text="Log In" disabled={pending} />
            <p aria-live="polite">{state?.message}</p>
        </form>
    )
}