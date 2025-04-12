"use client"
import { Alert } from "@heroui/react";
import { useParams } from "next/navigation";
import { useState } from "react"

export default function CriteriaConflicts ({ text }: { text: string }) {
    const [ isVisible, setIsVisible ] = useState<boolean>(true);
    const params = useParams();
    const lang = params.lang;

    return <Alert 
    color="warning"
    title={ lang === "es" ? "Conflicto en Especificación" : "Criteria Conflict" }
    className="mb-3"
    description={ text }
    variant="faded"
    isVisible={ isVisible }
    onClose={ () => setIsVisible(false) }/>
}