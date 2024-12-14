import { useState, useEffect, BaseSyntheticEvent } from "react";
import { isInputValid, arePasswordsConfirmed } from "../utils";

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
                window.grecaptcha.execute('6LfEx5EqAAAAAN3Ri6bU8BynXkRlTqh6l6mHbl4t', { action: 'signup'}).then(async (token: string) => {
                    const formData = new FormData(event.target);
                    formData.append('recaptcha_token', token);

                    if (isInputValid(formData).ok && arePasswordsConfirmed(formData)) {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/signup`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                token: formData.get('recaptcha_token'),
                                name: formData.get('name'),
                                username: formData.get('username'),
                                birthday: formData.get('birthday'),
                                email: formData.get('email'),
                                password: formData.get('password'),
                            })
                        })
                        const res = await response.json();
                        if (res.status === 500) {
                            setError(res.statusText);
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