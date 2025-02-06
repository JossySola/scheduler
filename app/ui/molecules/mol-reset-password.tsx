'use client'
import { sendResetPasswordConfirmation } from "../../lib/utils";
import { SubmitButton } from "@/app/ui/atoms/atom-button";
import { useState } from "react";
import { handlePasswordReset, handleTokenConfirmation } from "../../(routes)/reset/actions";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function ResetPassword() {
    const [ email, setEmail ] = useState<string | undefined>('');
    const [ emailSent, setEmailSent ] = useState<boolean>(false);
    const [ tokenConfirmed, setTokenConfirmed ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string>('');
    const [ resetSuccessful, setResetSuccessful ] = useState<boolean>(false);

    if (resetSuccessful) {
        return (
            <>
                <p>{message}</p>
                <Link href={'/login'}>Login</Link>
            </>
            
        )
    } else if (tokenConfirmed) {
        return (
            <form onSubmit={ async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                const password = formData.get('password')?.toString();
                const confirmationPassword = formData.get('confirm-password')?.toString();

                const reset = await handlePasswordReset(password, confirmationPassword, email);
                
                if (reset) {
                    setResetSuccessful(true);
                    setMessage(reset.statusText);
                    signOut();
                } else {
                    setMessage(`${reset.statusText}`)
                }

            }}>
                <input name="password" id="password" autoComplete="new-password" type="password" required />
                <input name="confirm-password" id="confirm-password" autoComplete="new-password" type="password" required />
                <p>{message}</p>
                <SubmitButton text="Reset password" />
            </form>
        )
    } else if (emailSent) {
        return (
            <form onSubmit={ async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                const token = formData.get('confirmation-token')?.toString();
            
                const confirmation = await handleTokenConfirmation(token, email);
                
                if (confirmation) {
                    setTokenConfirmed(true);
                } else {
                    setMessage(`${confirmation.statusText}`)
                }
            }}>
                <p>Type the code sent to your email here:</p>
                <input name="confirmation-token" id="confirmation-token" maxLength={6} required/>
                <p>{message}</p>
                <SubmitButton text="Confirm Code" />
            </form>
        )
    } else {
        return (
            <>
                <form onSubmit={ async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    const email = formData.get('email')?.toString();
    
                    await sendResetPasswordConfirmation(email);
                    setEmailSent(true);
                    setEmail(email)
                }}>
                    <p>Please type your email to send a verification code</p>
                    <input name="email" id="email" placeholder="email@provider.com" required/>
                    <SubmitButton text="Send Code" />
                </form>
            </>
        )
    }
}