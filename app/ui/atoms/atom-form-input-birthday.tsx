"use client"

import { useState } from "react"

export default function FormInputBirthday () {
    const [ birthday, setBirthday ] = useState<string>('');
    return (
        <>
            <label htmlFor="birthday">Birthday:</label>
            <input type="date" id="birthday" name="birthday" value={birthday} max="2012-12-31" required
            onChange={(e => {
                e.preventDefault();
                setBirthday(e.target.value);
            })} />
        </>
    )
}