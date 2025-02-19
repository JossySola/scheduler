"use client"
import { Input } from "@heroui/react";
import { useParams } from "next/navigation";
import { useState } from "react"

export default function FormInputBirthday () {
    const [ birthday, setBirthday ] = useState<string>('');
    const params = useParams();
    const { lang } = params;

    return (
        <Input 
        name="birthday"
        type="date"
        value={birthday}
        max="2012-12-31"
        className="sm:w-[400px] m-2"
        isRequired
        radius="md"
        variant="bordered"
        label={ lang === "es" ? "Fecha de nacimiento " : "Birthday " }
        size="lg"
        onChange={(e => {
            setBirthday(e.target.value);
        })}/>
    )
}