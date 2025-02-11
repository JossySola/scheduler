"use client"
import { Button } from "@heroui/react";
import { useParams } from "next/navigation";
import { MouseEventHandler, useCallback, useTransition } from "react";

export function SecondaryButton({callback, text, className}: {
    callback: (event: React.MouseEvent<HTMLButtonElement>) => void,
    text: string | null,
    className?: string,
}) {
    return (
        <Button onPress={callback} className={className}>{ text }</Button>
    )
}

export function SubmitButton({text, color = "", className, disabled, form, formaction, formenctype, formmethod, formnovalidate, formtarget, isSubmitting = false, isSubmitted = false, onClick, onSubmit}: {
    text: string,
    color?: string,
    className?: string,
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
    const params = useParams();
    const { lang } = params;
    const submitting = lang === "es" ? "Enviando..." : "Submitting...";
    const submitted = lang === "es" ? "Enviado!" : "Submitted!";

    if (color) {
        return <Button 
        type="submit"
        className={className} 
        isLoading={isSubmitting}
        color={color}
        disabled={disabled} 
        form={form} 
        formAction={formaction} 
        formEncType={formenctype} 
        formMethod={formmethod} 
        formNoValidate={formnovalidate} 
        formTarget={formtarget} 
        onPress={onClick} 
        onSubmit={onSubmit}>
            {text}
            {isSubmitting ? submitting: null}
            {isSubmitted ? submitted : null}
    </Button>
    }
    return <Button 
        type="submit" 
        isLoading={isSubmitting}
        className={`${className} bg-white text-black font-semibold`}
        radius="md"
        disabled={disabled} 
        form={form} 
        formAction={formaction} 
        formEncType={formenctype} 
        formMethod={formmethod} 
        formNoValidate={formnovalidate} 
        formTarget={formtarget} 
        onPress={onClick} 
        onSubmit={onSubmit}>
            {text}
            {isSubmitting ? submitting: null}
            {isSubmitted ? submitted : null}
    </Button>
}

export function ActionButton({action, text, className, disabled, form, formaction, formenctype, formmethod, formnovalidate, formtarget, isSubmitting = false, isSubmitted = false, onClick, onSubmit}: {
    action: string,
    text: string,
    className?: string,
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

    return <Button
            isLoading={isPending}
            className={`${className} bg-black text-white w-fit`}
            radius="md"
            disabled={disabled}
            form={form}
            formAction={formaction}
            formEncType={formenctype}
            formMethod={formmethod}
            formNoValidate={formnovalidate}
            formTarget={formtarget}
            onPress={handleClick}
            onSubmit={onSubmit}
            >
            {text}
    </Button>
}