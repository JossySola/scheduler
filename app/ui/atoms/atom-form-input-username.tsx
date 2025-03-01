"use client"
import { Input } from "@heroui/react";
import { useParams } from "next/navigation";

export default function FormInputUsername () {
    const params = useParams();
    const lang = params.lang;
    
    return (
        <Input 
        name="username"
        type="text"
        maxLength={15}
        autoComplete="username"
        className="sm:w-[400px] m-2"
        isRequired
        isClearable
        radius="md"
        variant="bordered"
        label={ lang === "es" ? "Nombre de usuario " : "Username " }
        labelPlacement="outside"
        size="lg"/>
    )
}