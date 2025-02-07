"use client"
import { SendResetEmailAction } from "@/app/(routes)/login/actions"
import { useState } from "react";

export default function PasswordResetButton () {
    const [ sent, setSent ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string>("");

    return (
        <>
        <button type="button" onClick={async () => {
            const response = await SendResetEmailAction();
            if (response.ok) {
                setSent(true);
            }
            setMessage(response.message);
        }} disabled={sent}>Reset password</button>
        <p>{message}</p>
        </>
    )
}