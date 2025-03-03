"use client"

import { SaveTableAction } from "@/app/[lang]/table/actions"
import { useActionState } from "react"
import { ActionButton } from "./atom-button";
import { FloppyDisk } from "geist-icons";

export default function TableButtonSave ({ lang }: {
    lang: "en" | "es"
}) {
    const [ saveState, saveAction, savePending ] = useActionState(SaveTableAction, { message: "" });

    return (
        <>
        <p aria-live="polite" className="text-danger">{ saveState.message }</p>
        <ActionButton 
        type="submit"
        formAction={ saveAction }
        loading={ savePending }
        disabled={ savePending }
        endContent={<FloppyDisk width="16px" />}>
            { lang === "es" ? "Guardar" : "Save" }
        </ActionButton>
        </>
    )
}