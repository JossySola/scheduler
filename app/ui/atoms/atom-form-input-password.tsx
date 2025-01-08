"use client"
import { useState } from "react";

export default function FormInputPassword () {
    const [ reveal, setReveal ] = useState<boolean>(false);
    const [ length, setLength ] = useState<boolean>(false);
    const [ password, setPassword ] = useState<string>('');
    const [ confirmation, setConfirmation ] = useState<string>('');

    return (
        <fieldset>
            <label htmlFor="password">Set a password:</label>
            <input type={reveal ? "text" : "password"} id="password" name="password" value={password} minLength={8} required 
            onChange={(e) => {
                e.preventDefault();
                const value = e.target.value;
                setLength(value.length >= 8);
                setPassword(e.target.value);
            }} autoComplete="new-password"/>

            <button type="button" onClick={() => {
                setReveal(!reveal);
            }}>Reveal</button>

            <section>
                <p>{length ? '✔️' : '❌'} Has at least 8 characters</p>
            </section>

            <label htmlFor="confirmpwd">Confirm password:</label>
            <input type={reveal ? "text" : "password"} id="confirm-new-password" name="confirmpwd" value={confirmation} autoComplete="new-password" minLength={8} required 
            onChange={e => {
                e.preventDefault();
                setConfirmation(e.target.value);
            }}/>
        </fieldset>
    )
}