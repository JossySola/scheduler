"use client"

import { Button } from "@heroui/react"
import { FloppyDisk } from "../icons"
import { useParams } from "next/navigation"

export default function SaveButton () {
    const params = useParams<{ lang: "es" | "en" }>();
    const { lang } = params;
    return (
        <Button
        type="button"
        size="lg"
        className="dark:bg-white bg-black dark:text-black text-white text-lg"
        endContent={<FloppyDisk />}>
            { lang === "es" ? "Guardar" : "Save" }
        </Button>
    )
}