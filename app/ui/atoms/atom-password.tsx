'use client'
import { Input } from "@heroui/react";
import { useParams } from "next/navigation";
import { useState } from "react"
import { EyeFilledIcon, EyeSlashFilledIcon } from "./atom-eyeslash";

export default function Password () {
    const [ isVisible, setIsVisible ] = useState<boolean>(false);
    const [ password, setPassword ] = useState<string>("");
    const params = useParams();
    const { lang } = params;

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <Input 
        isRequired
        type={ isVisible ? "text" : "password" }
        isClearable
        radius="sm"
        size="lg"
        variant="bordered"
        minLength={8}
        autoComplete="current-password"
        label={ lang === "es" ? "Contraseña" : "Password" }
        labelPlacement="outside"
        value={ password }
        onChange={ e => setPassword(e.target.value) }
        endContent={
            <button aria-label="toggle password visibility" className="focus:outline-none" type="button" onClick={toggleVisibility}>
                { isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
            </button>
        } />
    )
}