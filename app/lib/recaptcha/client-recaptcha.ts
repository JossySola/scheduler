import { useState, useEffect, BaseSyntheticEvent } from "react";
import { arePasswordsConfirmed, isInputValid, isPasswordPwned } from "../utils";

export default function useReCAPTCHA () {
    'use client'
    const [ windowIsLoaded, setWindowIsLoaded ] = useState<Window | null>(null);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ error, setError ] = useState<string>('');

    useEffect(() => {
        if (window) {
            setWindowIsLoaded(window);
        }
    })

    const signupCAPTCHA = async (event: BaseSyntheticEvent<Event & EventTarget & HTMLFormElement & EventTarget>) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            await window.grecaptcha.ready(() => {
                window.grecaptcha.execute('6LfEx5EqAAAAAN3Ri6bU8BynXkRlTqh6l6mHbl4t', { action: 'signup'}).then(async (grecaptchaToken: string) => {
                    const formData = new FormData(event.target);
                    formData.append('recaptcha_token', grecaptchaToken);
                    
                    const token = formData.get('recaptcha_token')?.toString();
                    const name = formData.get('name')?.toString();
                    const username = formData.get('username')?.toString();
                    const birthday = formData.get('birthday')?.toString();
                    const email = formData.get('email')?.toString();
                    const password = formData.get('password')?.toString();
                    
                    const passwordIsNotExposed = await isPasswordPwned(password!);
                    const passwordIsConfirmed = await arePasswordsConfirmed(formData);
                    const inputIsValid = await isInputValid(formData);
                    
                    if (inputIsValid.ok && passwordIsNotExposed === 0 && passwordIsConfirmed) {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/signup`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                token,
                                name,
                                username,
                                birthday,
                                email,
                                password,
                            })
                        })
                        const res = await response.json();
                        if (res.status === 500) {
                            setError(res.statusText);
                        }
                    } else {
                        if (passwordIsNotExposed > 0) {
                            setError('Upon a password verification, unfortunately this password has been exposed in a data breach. For security reasons, please choose another password.');
                            return;
                        } else if (passwordIsConfirmed === false) {
                            setError('The password confirmation is likely to have an error');
                            return;
                        } else {
                            setError(inputIsValid.message);
                            return;
                        }
                    }
                })
            })
        } catch (error) {
            setError('Failed loading initial dependency.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        error,
        isSubmitting,
        windowIsLoaded,
        signupCAPTCHA,
    }
}