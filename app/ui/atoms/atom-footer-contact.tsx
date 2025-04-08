"use client"
import { Button } from "@heroui/react"
import { Envelope } from "geist-icons"
import { redirect, useParams } from "next/navigation"

export default function FooterContact () {
    const params = useParams();
    const lang = params.lang ?? "en";
    return <Button radius="full" className="bg-[#f0eee670] dark:bg-[#3F3F4670] backdrop-blur-sm" onPress={() => redirect(`${process.env.NEXT_PUBLIC_ORIGIN}/${lang}/contact`)}>
        <Envelope />
    </Button>
}