'use client'
import { SaveAction } from "@/app/(routes)/table/create/actions"
import TablePanel from "../molecules/mol-table-panel"
import { SubmitButton } from "../atoms/atom-button"
import { Action_State } from "@/app/lib/definitions"
import { useActionState } from "react"

export default function SaveTableForm() {
    const initialState: Action_State = {
        message: null,
        errors: {}
    }
    const [state, formAction, isPending] = useActionState(SaveAction, initialState);
    
    return (
        <form action={formAction} id="new-table" className="flex flex-col" aria-describedby="form-error">
            <input name="table-name" id="table-name" type="text" defaultValue="Untitled" placeholder="Untitled" />
            <TablePanel />
            <SubmitButton text="save" isSubmitting={isPending ? true : false} />
            <div id="form-error" aria-live="polite" aria-atomic="true">
                {state?.message && <p>{state?.message}</p>}
            </div>
        </form>
    )
}