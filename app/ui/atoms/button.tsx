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

export function SubmitButton() {

}