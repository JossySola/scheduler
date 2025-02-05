"use client"
import { MouseEventHandler, useCallback, useTransition } from "react";

export function Button({callback, text}: {
    callback: (event: React.MouseEvent<HTMLButtonElement>) => void,
    text: string | null,
}) {
    return (
        <button type="button" onClick={(e) => {
            callback(e);
        }}>{text}</button>
    )
}

export function SubmitButton({text, disabled, form, formaction, formenctype, formmethod, formnovalidate, formtarget, isSubmitting = false, isSubmitted = false, onClick, onSubmit}: {
    text: string,
    disabled?: boolean,
    form?: string,
    formaction?: string | ((formData: FormData) => void | Promise<void>),
    formenctype?: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain",
    formmethod?: "post" | "get" | "dialog",
    formnovalidate?: boolean,
    formtarget?: "_self" | "_blank" | "_parent" | "_top",
    isSubmitting?: boolean,
    isSubmitted?: boolean,
    onClick?: MouseEventHandler<HTMLButtonElement> | undefined,
    onSubmit?: MouseEventHandler<HTMLButtonElement> | undefined,
}) {
    
    return <button 
    type="submit"
    disabled={disabled}
    form={form}
    formAction={formaction}
    formEncType={formenctype}
    formMethod={formmethod}
    formNoValidate={formnovalidate}
    formTarget={formtarget}
    onClick={onClick}
    onSubmit={onSubmit}
    >
    {text}{isSubmitting ? "Submitting...": null}{isSubmitted ? "Submitted!" : null}
    </button> 
        
}

export function ActionButton({action, text, disabled, form, formaction, formenctype, formmethod, formnovalidate, formtarget, isSubmitting = false, isSubmitted = false, onClick, onSubmit}: {
    action: string,
    text: string,
    disabled?: boolean,
    form?: string,
    formaction?: string | ((formData: FormData) => void | Promise<void>),
    formenctype?: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain",
    formmethod?: "post" | "get" | "dialog",
    formnovalidate?: boolean,
    formtarget?: "_self" | "_blank" | "_parent" | "_top",
    isSubmitting?: boolean,
    isSubmitted?: boolean,
    onClick?: MouseEventHandler<HTMLButtonElement> | undefined,
    onSubmit?: MouseEventHandler<HTMLButtonElement> | undefined,
}) {
    "use client"
    const [ isPending, startTransition ] = useTransition();
    
    const handleClick = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const key = '6LfEx5EqAAAAAN3Ri6bU8BynXkRlTqh6l6mHbl4t';
        if (!key) {
            console.error("Google reCAPTCHA key is missing.");
            return;
        }

        const formElement = (e.currentTarget as HTMLButtonElement).form;
        if (!formElement || !formaction) return;

        try {
            await new Promise<void>((resolve) => {
                window.grecaptcha.ready(() => {
                    window.grecaptcha
                    .execute(key, { action })
                    .then(async (token: string) => {
                        const request = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/grecaptcha`, {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ token })
                        });
                        
                        if (request.status !== 200) {
                            throw new Error("reCAPTCHA verification failed");
                        }
                        resolve();
                    })
                    .catch((error: unknown) => {
                        console.error("Error executing reCAPTCHA: ", error);
                        throw error;
                    });
                });
            });
            const formData = new FormData(formElement);

            startTransition(async () => {
                try {
                    if (typeof formaction === 'function') {
                        await formaction(formData);
                        onClick?.(e);
                        onSubmit?.(e);
                    }
                } catch (error) {
                    console.error("Error during form submission: ", error);
                }
            });
        } catch (error) {
            console.error("Error during reCAPTCHA verification: ", error);
        }
    }, [action, formaction, onClick, onSubmit]);

    return <button
            disabled={disabled}
            form={form}
            formAction={formaction}
            formEncType={formenctype}
            formMethod={formmethod}
            formNoValidate={formnovalidate}
            formTarget={formtarget}
            onClick={handleClick}
            onSubmit={onSubmit}
            >
            {text}
    </button>
}