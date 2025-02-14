"use client"
import { Input } from "@heroui/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "./atom-eyeslash";

export default function FormInputPassword () {
    const [ password, setPassword ] = useState<string>('');
    const [ confirmation, setConfirmation ] = useState<string>('');

    const [ isVisible, setIsVisible ] = useState<boolean>(false);
    const params = useParams();
    const { lang } = params;

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <>
            <Input 
            name="password"
            type={ isVisible ? "text" : "password" }
            value={ password }
            minLength={8}
            autoComplete="new-password"
            className="sm:w-[400px] m-2"
            isRequired
            radius="md"
            variant="bordered"
            label={ lang === "es" ? "Crear contraseña " : "Set a password " }
            labelPlacement="outside"
            size="lg"
            description={ lang === "es" ? "Recomendamos ampliamente utilizar tu Administrador de contraseñas para crear una contraseña segura. De este modo, ¡la contraseña quedará guardada en tu dispositivo y podrás utilizarla sin necesidad de memorizarla!" : "We highly recommend using your Password Manager suggestion to create a strong password. This way, your password will be securely stored and you'll be able to use it without the need to memorize it!"}
            onChange={(e) => {
                setPassword(e.target.value);
            }}
            endContent={
                <button aria-label="toggle password visibility" className="focus:outline-none" type="button" onClick={toggleVisibility}>
                    { isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                </button>
            }
            validate={value => {
                if (value.length < 8) {
                    return lang === "es" ? "Ingresa al menos 8 caracteres" : "Enter at least 8 characters";
                }
            }}/>

            <Input 
            name="confirmpwd"
            type={ isVisible ? "text" : "password" }
            value={confirmation} 
            minLength={8} 
            autoComplete="new-password"
            className="sm:w-[400px] m-2"
            isRequired
            radius="md"
            variant="bordered"
            label={ lang === "es" ? "Confirmar contraseña: " : "Confirm password: " }
            labelPlacement="outside"
            size="lg"
            onChange={e => {
                setConfirmation(e.target.value);
            }}
            endContent={
                <button aria-label="toggle password visibility" className="focus:outline-none" type="button" onClick={toggleVisibility}>
                    { isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                </button>
            }
            validate={value => {
                if (value !== password) {
                    return lang === "es" ? "La confirmación y la contraseña deben ser idénticas" : "The confirmation and password must be the same";
                }
            }}/>
        </>
    )
}