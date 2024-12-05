import { useCallback, useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { SubmitButton } from "./atom-button";

export default function ReCAPTCHA ({text, formAction, action}: {
    text: string,
    formAction?: string | ((formData: FormData) => void | Promise<unknown>),
    action: string,
}) {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [token, setToken] = useState('');

    const clickHandler = useCallback(async () => {
        if (!executeRecaptcha) {
            return;
        }
        const result = await executeRecaptcha(action);

        if (formAction && typeof formAction === 'function') {
            const formData = new FormData();
            formData.append('recaptcha_token', result);
            formAction(formData);
        }
    }, [executeRecaptcha]);

    useEffect(() => {
        if (!executeRecaptcha) {
            return;
        }
        const handleReCaptchaVerify = async () => {
            const token = await executeRecaptcha(action);
            setToken(token);
        };
        handleReCaptchaVerify();
    }, [executeRecaptcha]);

    return (
        <>
            <SubmitButton text={text} formaction={formAction} onClick={clickHandler} disabled={!executeRecaptcha}/>
            <p>{token}</p>
        </>
    )
}