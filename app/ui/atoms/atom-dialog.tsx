"use client"
import { RefObject } from "react"
import { Button } from "./atom-button";

export default function Dialog ({ children, ref }: {
    ref: RefObject<HTMLDialogElement | null>,
    children: React.JSX.Element,
}) {
    const handleCancel = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (ref.current) {
            ref.current.close();
        }
    }

    return (
        <dialog ref={ref}>
            { children }
            <Button text="Cancel" callback={handleCancel} />
        </dialog>
    )
}