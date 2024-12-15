'use client'
import { useState } from "react"

export default function Password () {
    const [ reveal, setReveal ] = useState<boolean>(false);
    return (
        <>
            <input type={reveal ? "text" : "password"} id="password" name="password" />
            <button 
                type="button" 
                onClick={() => {
                    setReveal(!reveal);
            }}>Reveal</button>
        </>
    )
}