"use client"
import { Input } from "@heroui/react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function FormInputUsername () {
    const [ username, setUsername ] = useState<string>('');
    const params = useParams();
    const { lang } = params;

    return (
        <Input 
        name="username"
        type="text"
        value={username}
        maxLength={15}
        autoComplete="username"
        className="sm:w-[400px] m-2"
        isRequired
        isClearable
        radius="md"
        variant="bordered"
        label={ lang === "es" ? "Nombre de usuario " : "Username " }
        labelPlacement="outside"
        size="lg"
        onChange={e => {
            setUsername(e.target.value);
        }}
        validate={value => {
            if (!value) {
                return lang === "es" ? "Por favor crea un nombre de usuario" : "Please enter a username"
            }
            if (value.length > 15) {
                return lang === "es" ? "El nombre de usuario es muy largo, intenta con uno más corto" : "The username is too large, please try with a shorter username";
            }
        }}/>
    )
}