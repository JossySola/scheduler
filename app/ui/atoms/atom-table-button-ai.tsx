"use client"
import { UseAiAction } from "@/app/[lang]/table/actions"
import { useActionState } from "react"
import { PrimaryButton } from "./atom-button";
import { Box } from "geist-icons";

export default function TableButtonAi ({ lang, isDisabled }: {
    lang: "en" | "es",
    isDisabled?: boolean,
}) {
    const [ genState, genAction, genPending ] = useActionState(UseAiAction, { message: "" });

    return (
        <>
        <p aria-live="polite" className="text-danger">{ genState.message }</p>
        <PrimaryButton 
        formAction={ genAction }
        type="submit"
        endContent={ <Box /> }
        disabled={ genPending || isDisabled }
        loading={ genPending }>
            { lang === "es" ? "Generar" : "Generate" }
        </PrimaryButton>
        </>
    )
}