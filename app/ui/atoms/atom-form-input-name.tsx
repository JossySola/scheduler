"use client"
import { Input } from "@heroui/react";
import { useParams } from "next/navigation";
import { useState } from "react"

export default function FormInputName () {
    const [ name, setName ] = useState<string>('');
    const params = useParams();
    const { lang } = params;

    return (
        <Input 
        name="name"
        type="text"
        value={name}
        maxLength={30}
        autoComplete="name"
        className="sm:w-[400px] m-2"
        isRequired
        isClearable
        radius="md"
        variant="bordered"
        label={ lang === "es" ? "Nombre " : "Name " }
        labelPlacement="outside"
        size="lg"
        onChange={(e => {
            setName(e.target.value);
        })}
        validate={value => {
            if (!value) {
                return lang === "es" ? "Por favor ingresa tu nombre" : "Please enter your name"
            }
        }}/>
    )
}