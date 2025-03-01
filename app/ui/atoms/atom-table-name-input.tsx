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
        size="lg"
        className="w-fit"
        autoComplete="off"
        defaultValue={name}
        isClearable />
    }
    return <Input 
    type="text" 
    name="table_title" 
    id="table_title"
    variant="underlined"
    size="lg"
    className="w-fit"
    autoComplete="off"
    isClearable />
}