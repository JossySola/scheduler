"use client"
import { Button } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import { ArrowCircleLeft } from "../icons";

export function BackButton () {
    const router = useRouter();
    const params = useParams<{ lang: "en" | "es"}>();
    const { lang } = params;
    return (
        <Button
        isIconOnly
        variant="light"
        aria-label={ lang === "es" ? "Volver" : "Go back" }
        onPress={ () => router.back() }>
            <ArrowCircleLeft width={32} height={32} />
        </Button>
    )
}