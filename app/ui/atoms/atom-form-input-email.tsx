"use client"
import { useParams } from "next/navigation";
import { useState } from "react"

export default function FormInputEmail () {
    const [ email, setEmail ] = useState<string>('');
    const params = useParams();
    const { lang } = params;

    return (
        <>
            <label htmlFor="email">{ lang === "es" ? "Correo electrónico:" : "Email:" }</label>
            <input type="email" id="email" name="email" value={email} placeholder="example@domain.com" autoComplete="email" required
            onChange={(e => {
                setEmail(e.target.value);
            })} />
        </>
    )
}