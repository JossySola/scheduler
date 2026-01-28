"use client"
import { Input } from "@heroui/react";
import { useParams } from "next/navigation";
import { SetStateAction } from "react";

export default function FormInputUsername ({ username, setUsername }: {
    username: string,
    setUsername: React.Dispatch<SetStateAction<string>>,
}) {
    const params = useParams();
    const lang = params.lang;
    
    return (
        <Input 
        name="username"
        aria-label={ lang === "es" ? "Nombre de usuario " : "Username " }
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
        size="lg"
        value={ username }
        onChange={e => setUsername(e.target.value) }/>
    )
}
