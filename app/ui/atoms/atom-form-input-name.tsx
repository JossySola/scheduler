"use client"
import { Input } from "@heroui/react";
import { useParams } from "next/navigation";

export default function FormInputName () {
    const params = useParams();
    const lang = params.lang;

    return (
        <Input 
        name="name"
        type="text"
        maxLength={30}
        autoComplete="name"
        className="sm:w-[400px] m-2"
        isRequired
        isClearable
        radius="md"
        variant="bordered"
        label={ lang === "es" ? "Nombre " : "Name " }
        labelPlacement="outside"
        size="lg"/>
    )
}