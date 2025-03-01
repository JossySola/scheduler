"use client"
import { Input } from "@heroui/react";
import { useParams } from "next/navigation";

export default function FormInputBirthday () {
    const params = useParams();
    const lang = params.lang;
    
    return (
        <Input 
        name="birthday"
        type="date"
        max="2012-12-31"
        className="sm:w-[400px] m-2"
        isRequired
        radius="md"
        variant="bordered"
        label={ lang === "es" ? "Fecha de nacimiento " : "Birthday " }
        size="lg"/>
    )
}