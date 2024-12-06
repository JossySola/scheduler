import { useState, useEffect, BaseSyntheticEvent } from "react";
import { isInputValid, arePasswordsConfirmed } from "./utils";

export default function useReCAPTCHA (action: string) {
    const [ windowIsLoaded, setWindowIsLoaded ] = useState<Window | null>(null);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    useEffect(() => {
        if (window) {
            setWindowIsLoaded(window);
        }
    })

    const executeCAPTCHA = async (event: BaseSyntheticEvent<Event & EventTarget & HTMLFormElement & EventTarget>) => {
        try {
            setIsSubmitting(true);
            const token = await window.grecaptcha.execute('6LfEx5EqAAAAAN3Ri6bU8BynXkRlTqh6l6mHbl4t', { action: action });
            const formData = new FormData(event.target);
            formData.append('recaptcha_token', token);
            
            if (isInputValid(formData).ok && arePasswordsConfirmed(formData)) {
                const body = await fetch('http://localhost:3000/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: JSON.stringify({
                        token: formData.get('recaptcha_token'),
                        name: formData.get('name'),
                        username: formData.get('username'),
                        birthday: formData.get('birthday'),
                        email: formData.get("email"),
                        password: formData.get("password"),
                    })
                })
            }
        } catch (error) {
            return
        } finally {
            setIsSubmitting(false);
        }
        
    }

    return {
        isSubmitting,
        windowIsLoaded,
        executeCAPTCHA,
    }
}