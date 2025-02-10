"use client"
import { useParams } from "next/navigation";
import { useState } from "react";

export default function FormInputPassword () {
    const [ reveal, setReveal ] = useState<boolean>(false);
    const [ length, setLength ] = useState<boolean>(false);
    const [ password, setPassword ] = useState<string>('');
    const [ confirmation, setConfirmation ] = useState<string>('');
    const params = useParams();
    const { lang } = params;

    return (
        <fieldset>
            <label htmlFor="password">{ lang === "es" ? "Crear contraseña:" : "Set a password:" }</label>
            <input type={reveal ? "text" : "password"} id="password" name="password" value={password} minLength={8} required 
            onChange={(e) => {
                const value = e.target.value;
                setLength(value.length >= 8);
                setPassword(e.target.value);
            }} autoComplete="new-password"/>

            <button type="button" onClick={() => {
                setReveal(!reveal);
            }}>{ lang === "es" ? "Mostrar" : "Reveal" }</button>
            {
                lang === "es" ? 
                <p>Recomendamos ampliamente utilizar tu <b>Administrador de contraseñas</b> para crear una contraseña segura. De este modo, ¡la contraseña quedará guardada en tu dispositivo y podrás utilizarla sin necesidad de memorizarla!</p> :
                <p>We highly recommend using your <b>Password Manager</b> suggestion to create a strong password. This way, your password will be securely stored and you'll be able to use it without the need to memorize it!</p>
            }
            

            <section>
                <p>{length ? '✔️' : '❌'} { lang === "es" ? "Tiene al menos 8 caracteres" : "Has at least 8 characters" }</p>
            </section>

            <label htmlFor="confirmpwd">{ lang === "es" ? "Confirmar contraseña:" : "Confirm password:" }</label>
            <input type={reveal ? "text" : "password"} id="confirm-new-password" name="confirmpwd" value={confirmation} autoComplete="new-password" minLength={8} required 
            onChange={e => {
                setConfirmation(e.target.value);
            }}/>
        </fieldset>
    )
}