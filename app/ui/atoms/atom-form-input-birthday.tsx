"use client"
import { useParams } from "next/navigation";
import { useState } from "react"

export default function FormInputBirthday () {
    const [ birthday, setBirthday ] = useState<string>('');
    const params = useParams();
    const { lang } = params;

    return (
        <>
            <label htmlFor="birthday">{ lang === "es" ? "Fecha de nacimiento:" : "Birthday:" }</label>
            <input type="date" id="birthday" name="birthday" value={birthday} max="2012-12-31" required
            onChange={(e => {
                setBirthday(e.target.value);
            })} />
        </>
    )
}