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
        }}/>
    )
}