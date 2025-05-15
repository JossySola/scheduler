"use client"
import { useParams } from "next/navigation";
import { useContext } from "react";
import { AnthropicGenerationContext, AnthropicGenerationType } from "@/app/[lang]/table/context";
import { PrimaryButton } from "./atom-button";
import { Box } from "../icons";

export default function TableButtonAi () {
    const params = useParams();
    const lang = params.lang;
    const { anthropicAction, anthropicPending }: AnthropicGenerationType = useContext(AnthropicGenerationContext);

    return (
        <PrimaryButton
        type="submit"
        loading={ anthropicPending }
        disabled={ anthropicPending }
        formAction={ anthropicAction }
        endContent={ <Box /> }>
            { lang === "es" ? "Generar" : "Generate" }
        </PrimaryButton> 
    )
}