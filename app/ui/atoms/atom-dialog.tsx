"use client"
import { RefObject } from "react"
import { Button, SubmitButton } from "./atom-button";

export default function Dialog ({ ref, action, item_id }: {
    ref: RefObject<HTMLDialogElement | null>,
    action: (formData: FormData) => void,
    item_id: string,
}) {
    const handleCancel = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (ref.current) {
            ref.current.close();
        }
    }
    
    return (
        <dialog ref={ref}>
            <p autoFocus>Please confirm this action</p>

            <form action={action}>
                <input type="text" name="item_id" value={item_id} readOnly hidden/>
                <SubmitButton text="Confirm"/>
            </form>
            <Button text="Cancel" callback={handleCancel} />
        </dialog>
    )
}