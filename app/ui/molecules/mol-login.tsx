"use client"
import { useActionState, useEffect, useState } from "react";
import { SubmitButton } from "../atoms/atom-button";
import Password from "../atoms/atom-password";
import Link from "next/link";
import { LogInAction } from "@/app/(routes)/login/actions";
import PasswordResetButton from "../atoms/atom-button-password-reset";
import CountdownTimer from "../atoms/atom-timer-attempt";

export default function LogIn () {
    const [ loginState, loginAction, pending ] = useActionState(LogInAction, { message: "" });
    const [ message, setMessage ] = useState<string>("");
    const [ timestamp, setTimestamp ] = useState<string>("");

    useEffect(() => {
        const split = loginState.message.split('/');
        if (split) {
            split.forEach((text, index) => {
                if (index === 0 && typeof text === "string") {
                    setMessage(text)
                }
                if (typeof text === "string" && text.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
                    setTimestamp(text);
                }
            })
        }
    }, [loginState]);
    
    
    return (
        <>
            <form action={loginAction}>
                <label>
                    E-mail or username
                    <input name="username" id="username" type="text" autoComplete="username"/>
                </label>
                <label>
                    Password
                    <Password />
                </label>
                <PasswordResetButton />

                <p aria-live="polite">{message}</p>
                <CountdownTimer nextAttempt={timestamp} />
                <SubmitButton text="Login" disabled={pending} />
                
            </form>

            <p>If you don't have an account yet, <Link href={"/signup"}>Signup</Link></p>
        </>
    )
}