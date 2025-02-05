"use client"
import { useState } from "react";

export default function FormInputUsername () {
    const [ username, setUsername ] = useState<string>('');
    return (
        <>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" value={username} minLength={3} maxLength={15} required
            onChange={e => {
                setUsername(e.target.value);
            }}/>
        </>
    )
}