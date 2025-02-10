"use client"

import { useParams } from "next/navigation";
import { useState } from "react"

export default function FormInputName () {
    const [ name, setName ] = useState<string>('');
    const params = useParams();
    const { lang } = params;

    return (
        <>
            <label htmlFor="name">{ lang === "es" ? "Nombre:" : "Name:" }</label>
            <input type="text" id="name" name="name" value={name} minLength={3} maxLength={30} autoComplete="name" required
            onChange={(e => {
                setName(e.target.value);
            })} />
        </>
    )
}