export function Button({callback, text}: {
    callback: () => void,
    text: string | null,
}) {
    return (
        <button type="button" onClick={() => {
            callback();
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
    onClick?: () => void,
    onSubmit?: () => void,
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
    onClick?: () => void,
    onSubmit?: () => void,
}) {
    "use client"
    return <button
            disabled={disabled}
            form={form}
            formAction={formaction}
            formEncType={formenctype}
            formMethod={formmethod}
            formNoValidate={formnovalidate}
            formTarget={formtarget}
            onClick={async (e) => {
                e.preventDefault();
                const key = '6LfEx5EqAAAAAN3Ri6bU8BynXkRlTqh6l6mHbl4t';
                if (!key) {
                    console.error("Google reCAPTCHA key is missing.");
                }
                const formElement = (e.currentTarget as HTMLButtonElement).form;
                
                console.log(formElement)
                try {
                    await window.grecaptcha.ready(() => {
                        window.grecaptcha
                        .execute(key, { action })
                        .then(async (token: string) => {
                            const request = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/grecaptcha`, {
                                method: 'POST',
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    token
                                })
                            })
                            const response = await request.json();
                            if (response.status !== 200) {
                                throw Error;
                            }
                            
                            formElement?.submit();
                        })
                        .catch(() => {
                            console.error("Error executing reCAPTCHA");
                        })
                    })
                } catch (error) {
                    console.error(error);
                }

            }}
            onSubmit={onSubmit}
            >
            {text}
    </button>       
}