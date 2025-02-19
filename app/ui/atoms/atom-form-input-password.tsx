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
            }/>
            {
                lang === "es" ? 
                <p data-slot="description" className="text-tiny text-yellow-500 mb-2 sm:w-[390px]">Recomendamos ampliamente utilizar tu <b>Administrador de Contraseñas</b> para crear una contraseña segura. De este modo, ¡la contraseña quedará guardada en tu dispositivo de manera segura y podrás utilizarla sin necesidad de memorizarla!</p> :
                <p data-slot="description" className="text-tiny text-yellow-500 mb-2 sm:w-[390px]">We highly recommend using your <b>Password Manager</b> suggestion to create a strong password. This way, your password will be securely stored and you'll be able to use it without the need to memorize it!</p>
            }

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
            }/>
        </>
    )
}