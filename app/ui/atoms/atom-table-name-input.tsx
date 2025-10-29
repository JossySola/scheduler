"use client"
import { Input } from "@heroui/react";
import { useParams } from "next/navigation";

export default function TableNameInput ({ name }: {
    name?: string
}) {
    const params = useParams();
    const { lang } = params;
    if (name) {
        return <Input 
        type="text" 
        name="table_title" 
        aria-label={ lang === "es" ? "Nombre de la tabla" : "Table name" }
        id="table_title"
        variant="underlined"
        className="w-fit self-start sm:self-center"
        autoComplete="off"
        defaultValue={name}
        classNames={{
            input: ["text-xl"]
        }}
        isClearable />
    }
    return <Input 
    type="text" 
    aria-label={ lang === "es" ? "Nombre de la tabla" : "Table name" }
    name="table_title" 
    id="table_title"
    variant="underlined"
    className="w-fit self-start sm:self-center"
    autoComplete="off"
    classNames={{
        input: ["text-xl"]
    }}
    isClearable />
}