"use client"

import { Button } from "@heroui/react";
import { ArrowCircleLeft } from "geist-icons";
import { useRouter } from "next/navigation";

export function BackButton () {
    const router = useRouter();

    return (
        <Button
        isIconOnly
        variant="light"
        onPress={ () => router.back() }>
            <ArrowCircleLeft width="32px" height="32px" />
        </Button>
    )
}