"use client"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react";

export default function Modal ({ children }: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        if (!dialogRef.current?.open) {
            dialogRef.current?.showModal();
        }
    }, []);

    const onDismiss = () => {
        router.back();
    }

    return (
        <section>
            <dialog ref={dialogRef} onClose={onDismiss}>
                { children }
                <button type="button" onClick={onDismiss}>Close</button>
            </dialog>
        </section>
    )
}