"use client"
import { Input } from "@heroui/react";
import { useParams } from "next/navigation";

export default function FormInputEmail () {
    const params = useParams();
    const lang = params.lang;
    
    return (
        <Input 
        name="email"
        type="email"
        autoComplete="email"
        className="sm:w-[400px] m-2"
        isRequired
        isClearable
        radius="md"
        variant="bordered"
        label={ lang === "es" ? "Correo electrónico: " : "Email: " }
        labelPlacement="outside"
        size="lg"/>
    )
}