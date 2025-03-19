"use client"
import { Box } from "geist-icons";
import { useParams } from "next/navigation";
import { useContext } from "react";
import { AnthropicGenerationContext, AnthropicGenerationType } from "@/app/[lang]/table/context";
import { PrimaryButton } from "./atom-button";

export default function TableButtonAi ({ isDisabled }: {
    isDisabled?: boolean 
}) {
    const params = useParams();
    const lang = params.lang;
    const { anthropicAction, anthropicPending }: AnthropicGenerationType = useContext(AnthropicGenerationContext);

    return (
        <PrimaryButton
        type="submit"
        loading={ anthropicPending }
        disabled={ isDisabled || anthropicPending }
        formAction={ anthropicAction }
        endContent={ <Box /> }>
            { lang === "es" ? "Generar" : "Generate" }
        </PrimaryButton> 
    )
}