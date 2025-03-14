"use client"
import { Input } from "@heroui/react";

export default function TableNameInput ({ name }: {
    name?: string
}) {
    if (name) {
        return <Input 
        type="text" 
        name="table_title" 
        id="table_title"
        variant="underlined"
        className="w-fit self-start ml-7 sm:self-center"
        autoComplete="off"
        defaultValue={name}
        classNames={{
            input: ["text-xl"]
        }}
        isClearable />
    }
    return <Input 
    type="text" 
    name="table_title" 
    id="table_title"
    variant="underlined"
    className="w-fit self-start ml-7 sm:self-center"
    autoComplete="off"
    classNames={{
        input: ["text-xl"]
    }}
    isClearable />
}