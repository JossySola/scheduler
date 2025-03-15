"use client"
import { TableAiGenerationContext, TableAiGenerationType } from "@/app/[lang]/table/context";
import { PrimaryButton } from "./atom-button";
import { Box } from "geist-icons";
import { useParams } from "next/navigation";
import { useContext } from "react";

export default function TableButtonAi ({ isDisabled }: {
    isDisabled?: boolean 
}) {
    const params = useParams();
    const lang = params.lang;
    const { generateTableUseObject, isLoading }: TableAiGenerationType = useContext(TableAiGenerationContext);
    return (
        <PrimaryButton
        type="submit"
        formAction={ (formData) => generateTableUseObject && generateTableUseObject(formData) }
        endContent={ <Box /> }
        disabled={ isLoading || isDisabled }
        loading={ isLoading || isDisabled }>
            { lang === "es" ? "Generar" : "Generate" }
        </PrimaryButton>
    )
}