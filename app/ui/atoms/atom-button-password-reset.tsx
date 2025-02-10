"use client"
import { SendResetEmailAction } from "@/app/[lang]/login/actions"
import { useParams } from "next/navigation";
import { useState } from "react";

export default function PasswordResetButton () {
    const [ sent, setSent ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string>("");
    const params = useParams();
    const { lang } = params;

    return (
        <>
        <button type="button" onClick={async () => {
            const response = await SendResetEmailAction();
            if (response.ok) {
                setSent(true);
            }
            setMessage(response.message);
        }} disabled={sent}>{ lang === "es" ? "Restaurar contraseña" : "Reset password" }</button>
        <p>{message}</p>
        </>
    )
}