'use client'
import { useActionState } from "react"
import { SaveAction } from "./create/actions"
import { SubmitButton } from "@/app/ui/atoms/atom-button"

export default function Layout ({children}: {
    children: React.ReactNode
}) {
    const [saveState, saveAction, pendingSave] = useActionState(SaveAction, { message: '' });

    return (
        <form id="new-table" className="flex flex-col">
            { children }
            <SubmitButton text="Save" formaction={saveAction} isSubmitting={pendingSave} />
        </form>
    )
}