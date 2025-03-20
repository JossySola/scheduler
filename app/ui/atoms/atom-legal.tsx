"use client"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react"
import { BookOpen } from "geist-icons"
import { useParams } from "next/navigation"

export default function FooterLegal () {
    const params = useParams();
    const lang = params.lang ?? "en";
    return (
        <Dropdown placement="top" backdrop="blur">
            <DropdownTrigger>
                <Button radius="full" className="bg-[#f0eee670] backdrop-blur-sm w-fit"><BookOpen /></Button>
            </DropdownTrigger>
            <DropdownMenu>
                <DropdownItem key="privacy" href={`${process.env.NEXT_PUBLIC_ORIGIN}/${lang}/privacy`}>{ lang === "es" ? "Privacidad" : "Privacy" }</DropdownItem>
                <DropdownItem key="terms" href={`${process.env.NEXT_PUBLIC_ORIGIN}/${lang}/terms`}>{ lang === "es" ? "Términos de Uso" : "Terms of Use" }</DropdownItem>
                <DropdownItem key="delete-data" href={`${process.env.NEXT_PUBLIC_ORIGIN}/${lang}/delete-my-data`}>{ lang === "es" ? "Eliminar mi información" : "Delete My Data" }</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}