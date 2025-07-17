"use client"
import { Input } from "@heroui/react";
import { useParams } from "next/navigation";
import { SetStateAction, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "../icons";

export default function FormInputPassword ({ password, setPassword, confirmation, setConfirmation }: {
    password?: string,
    confirmation?: string,
    setPassword?: React.Dispatch<SetStateAction<string>>,
    setConfirmation?: React.Dispatch<SetStateAction<string>>,
}) {
    
    const [ isVisible, setIsVisible ] = useState<boolean>(false);
    const params = useParams();
    const { lang } = params;
    const [ localPassword, setLocalPassword ] = useState<string>("");
    const [ localConfirmation, setLocalConfirmation ] = useState<string>("");

    const toggleVisibility = () => setIsVisible(!isVisible);

    if (password && setPassword && confirmation && setConfirmation) {
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
                description={
                    lang === "es" ? 
                    <p>Recomendamos ampliamente utilizar tu <b>Administrador de Contraseñas</b> para crear una contraseña segura. De este modo, ¡la contraseña quedará guardada en tu dispositivo y podrás utilizarla sin necesidad de memorizarla!</p> :
                    <p>We highly recommend using your <b>Password Manager</b> suggestion to create a strong password. This way, your password will be securely stored and you'll be able to use it without the need to memorize it!</p>
                }
                labelPlacement="outside"
                size="lg"
                onValueChange={ setPassword }
                endContent={
                    <button 
                    aria-label="toggle password visibility"
                    className="focus:outline-none cursor-pointer"
                    type="button"
                    onClick={ toggleVisibility }>
                        { isVisible ? (
                            <EyeOff />
                        ) : (
                            <Eye />
                        )}
                    </button>
                }/>
    
                <Input 
                name="confirmpwd"
                type={ isVisible ? "text" : "password" }
                value={ confirmation } 
                minLength={8} 
                autoComplete="new-password"
                className="sm:w-[400px] m-2"
                isRequired
                radius="md"
                variant="bordered"
                label={ lang === "es" ? "Confirmar contraseña: " : "Confirm password: " }
                description={ lang === "es" ? <p>Al completar el proceso de registro e/o iniciando sesión con algún proveedor externo, aceptas nuestros <Link href={`${process.env.NEXT_PUBLIC_DEV_ORIGIN}/${lang}/terms`}>Términos y Condiciones</Link>.</p> : <p>By completing the sign up process and/or signing in with an external provider, you agree with our <Link href={`${process.env.NEXT_PUBLIC_DEV_ORIGIN}/${lang}/terms`}>Terms & Conditions</Link>.</p> }
                labelPlacement="outside"
                size="lg"
                onValueChange={ setConfirmation }
                endContent={
                    <button 
                    aria-label="toggle password visibility"
                    className="focus:outline-none cursor-pointer"
                    type="button"
                    onClick={ toggleVisibility }>
                        { isVisible ? (
                            <EyeOff />
                        ) : (
                            <Eye />
                        )}
                    </button>
                }/>
            </>
        )
    }
    return (
        <>
            <Input 
            name="password"
            type={ isVisible ? "text" : "password" }
            value={ password ?? localPassword }
            minLength={8}
            autoComplete="new-password"
            className="sm:w-[400px] m-2"
            isRequired
            radius="md"
            variant="bordered"
            label={ lang === "es" ? "Crear contraseña " : "Set a password " }
            description={
                lang === "es" ? 
                <p>Recomendamos ampliamente utilizar tu <b>Administrador de Contraseñas</b> para crear una contraseña segura. De este modo, ¡la contraseña quedará guardada en tu dispositivo y podrás utilizarla sin necesidad de memorizarla!</p> :
                <p>We highly recommend using your <b>Password Manager</b> suggestion to create a strong password. This way, your password will be securely stored and you'll be able to use it without the need to memorize it!</p>
            }
            labelPlacement="outside"
            size="lg"
            onValueChange={ setPassword ?? setLocalPassword }
            endContent={
                <button 
                aria-label="toggle password visibility"
                className="focus:outline-none cursor-pointer"
                type="button"
                onClick={ toggleVisibility }>
                    { isVisible ? (
                        <EyeOff />
                    ) : (
                        <Eye />
                    )}
                </button>
            }/>

            <Input 
            name="confirmpwd"
            type={ isVisible ? "text" : "password" }
            value={ confirmation ?? localConfirmation } 
            minLength={8} 
            autoComplete="new-password"
            className="sm:w-[400px] m-2"
            isRequired
            radius="md"
            variant="bordered"
            label={ lang === "es" ? "Confirmar contraseña: " : "Confirm password: " }
            description={ lang === "es" ? <p>Al completar el proceso de registro e/o iniciando sesión con algún proveedor externo, aceptas nuestros <Link href={`${process.env.NEXT_PUBLIC_DEV_ORIGIN}/${lang}/terms`}>Términos y Condiciones</Link>.</p> : <p>By completing the sign up process and/or signing in with an external provider, you agree with our <Link href={`${process.env.NEXT_PUBLIC_DEV_ORIGIN}/${lang}/terms`}>Terms & Conditions</Link>.</p> }
            labelPlacement="outside"
            size="lg"
            onValueChange={ setConfirmation ?? setLocalConfirmation }
            endContent={
                <button 
                aria-label="toggle password visibility"
                className="focus:outline-none cursor-pointer"
                type="button"
                onClick={ toggleVisibility }>
                    { isVisible ? (
                        <EyeOff />
                    ) : (
                        <Eye />
                    )}
                </button>
            }/>
        </>
    )
}