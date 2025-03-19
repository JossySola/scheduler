"use client"
import { Alert } from "@heroui/react";
import { useState } from "react"

export default function CriteriaConflicts ({ text }: { text: string }) {
    const [ isVisible, setIsVisible ] = useState<boolean>(true);

    return <Alert 
    color="warning"
    title="Criteria Conflict"
    className="mb-3"
    description={ text }
    variant="faded"
    isVisible={ isVisible }
    onClose={ () => setIsVisible(false) }/>
}