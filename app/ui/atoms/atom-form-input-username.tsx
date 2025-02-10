"use client"
import { useParams } from "next/navigation";
import { useState } from "react";

export default function FormInputUsername () {
    const [ username, setUsername ] = useState<string>('');
    const params = useParams();
    const { lang } = params;

    return (
        <>
            <label htmlFor="username">{ lang === "es" ? "Nombre de usuario:" : "Username:" }</label>
            <input type="text" id="username" name="username" value={username} minLength={3} maxLength={15} required
            onChange={e => {
                setUsername(e.target.value);
            }}/>
        </>
    )
}