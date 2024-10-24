'use client'

export function ActionButton({callback, text}: {
    callback: () => void,
    text: string | null,
}) {
    return (
        <button type="button" onClick={() => {
            callback();
        }}>{text}</button>
    )
}

export function SubmitButton({name, value, text, disabled, form, formaction, formenctype, formmethod, formnovalidate, formtarget}: {
    name: string,
    value: string,
    text: string,
    disabled?: boolean,
    form?: string,
    formaction?: string,
    formenctype?: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain",
    formmethod?: "post" | "get" | "dialog",
    formnovalidate?: boolean,
    formtarget?: "_self" | "_blank" | "_parent" | "_top",
}) {
    return (
        <button 
        name={name}
        value={value}
        type="submit"
        disabled={disabled}
        form={form}
        formAction={formaction}
        formEncType={formenctype}
        formMethod={formmethod}
        formNoValidate={formnovalidate}
        formTarget={formtarget}>{text}</button>
    )
}