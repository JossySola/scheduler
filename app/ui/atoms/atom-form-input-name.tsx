"use client"

import { useState } from "react"

export default function FormInputName () {
    const [ name, setName ] = useState<string>('');

    return (
        <>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={name} minLength={3} maxLength={30} autoComplete="name" required
            onChange={(e => {
                setName(e.target.value);
            })} />
        </>
    )
}