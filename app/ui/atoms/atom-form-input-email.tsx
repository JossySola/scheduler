"use client"

import { useState } from "react"

export default function FormInputEmail () {
    const [ email, setEmail ] = useState<string>('');
    return (
        <>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={email} placeholder="example@domain.com" autoComplete="email" required
            onChange={(e => {
                setEmail(e.target.value);
            })} />
        </>
    )
}