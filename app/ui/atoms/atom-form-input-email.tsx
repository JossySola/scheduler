"use client"
import { Input } from "@heroui/react";
import { useParams } from "next/navigation";
import { SetStateAction } from "react";

export default function FormInputEmail ({ email, setEmail }: {
    email: string,
    setEmail: React.Dispatch<SetStateAction<string>>,
}) {
    const params = useParams();
    const lang = params.lang;
    
    return (
        <Input 
        name="email"
        type="email"
        autoComplete="email"
        className="sm:w-[400px] m-2"
        isRequired
        isClearable
        radius="md"
        variant="bordered"
        label={ lang === "es" ? "Correo electrónico: " : "Email: " }
        labelPlacement="outside"
        size="lg"
        value={ email }
        onChange={e => setEmail(e.target.value) }/>
    )
}