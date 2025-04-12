"use client"
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react"
import { useParams } from "next/navigation"

export default function FooterCookies () {
    const params = useParams();
    const lang = params.lang;

    return <Popover placement="top">
        <PopoverTrigger>
            <Button radius="full" className="bg-[#f0eee670] dark:bg-[#3F3F4670] backdrop-blur-sm w-fit text-xl">🍪</Button>
        </PopoverTrigger>
        <PopoverContent>
            <div className="px-1 py-1">
                <p>{ lang === "es" ? "Usamos cookies para mantener tu sesión en caso de que inicies sesión en la aplicación." : "We use cookies to preserve your session if you sign in." }</p>
            </div>
        </PopoverContent>
    </Popover>
}