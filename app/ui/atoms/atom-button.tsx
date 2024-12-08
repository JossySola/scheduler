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

export function SubmitButton({text, disabled, form, formaction, formenctype, formmethod, formnovalidate, formtarget, isSubmitting = false, isSubmitted = false, onClick, onSubmit}: {
    text: string,
    disabled?: boolean,
    form?: string,
    formaction?: string | ((formData: FormData) => void | Promise<unknown>),
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