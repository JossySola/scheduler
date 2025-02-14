"use client"
import { Input } from "@heroui/react";
import { useParams } from "next/navigation";
import { useState } from "react"

export default function FormInputEmail () {
    const [ email, setEmail ] = useState<string>('');
    const params = useParams();
    const { lang } = params;

    return (
        <Input 
        name="email"
        type="email"
        value={email}
        autoComplete="email"
        className="sm:w-[400px] m-2"
        isRequired
        isClearable
        radius="md"
        variant="bordered"
        label={ lang === "es" ? "Correo electrónico: " : "Email: " }
        labelPlacement="outside"
        size="lg"
        onChange={(e => {
            setEmail(e.target.value);
        })}/>
    )
}