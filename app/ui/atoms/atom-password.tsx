'use client'
import { useParams } from "next/navigation";
import { useState } from "react"

export default function Password () {
    const [ reveal, setReveal ] = useState<boolean>(false);
    const params = useParams();
    const { lang } = params;

    return (
        <>
            <input type={reveal ? "text" : "password"} id="password" name="password" autoComplete="current-password"/>
            <button 
                type="button" 
                onClick={() => {
                    setReveal(!reveal);
            }}>{ lang === "es" ? "Mostrar" : "Reveal" }</button>
        </>
    )
}