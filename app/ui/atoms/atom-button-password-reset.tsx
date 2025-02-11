"use client"
import { SendResetEmailAction } from "@/app/[lang]/login/actions"
import { Button } from "@heroui/react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function PasswordResetButton ({ className }: {
    className?: string,
}) {
    const [ sent, setSent ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string>("");
    const params = useParams();
    const { lang } = params;

    return (
        <>
        <Button 
        className={`${className} bg-transparent border-2`}
        isDisabled={sent}
        onPress={async () => {
            const response = await SendResetEmailAction();
            if (response.ok) {
                setSent(true);
            }
            setMessage(response.message);
        }}>{ lang === "es" ? "Restaurar contraseña" : "Reset password" }</Button>
        
        <p>{message}</p>
        </>
    )
}