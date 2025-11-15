"use client"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react"
import { useParams } from "next/navigation"
import { Envelope } from "../icons";

export default function FooterContact () {
    const params = useParams();
    const lang = params.lang ?? "en";
    return (
        <Dropdown placement="top" backdrop="blur">
            <DropdownTrigger>
                <Button 
                aria-label={ lang === "es" ? "Contacto" : "Contact" }
                radius="full" 
                className="bg-[#f0eee670] dark:bg-[#3F3F4670] backdrop-blur-sm w-fit">
                    <Envelope />
                </Button>
            </DropdownTrigger>
            <DropdownMenu>
                <DropdownItem key="contact" href={`${process.env.NEXT_PUBLIC_ORIGIN}/${lang}/contact`}>{ lang === "es" ? "Contacto" : "Contact" }</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}