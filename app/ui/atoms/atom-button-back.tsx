"use client"

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ArrowCircleLeft } from "../icons";

export function BackButton () {
    const router = useRouter();

    return (
        <Button
        isIconOnly
        variant="light"
        onPress={ () => router.back() }>
            <ArrowCircleLeft width={32} height={32} />
        </Button>
    )
}