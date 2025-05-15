"use client"
import { useActionState, useEffect, useState } from "react";
import SignInProviders from "./mol-signin-providers";
import FormInputName from "../atoms/atom-form-input-name";
import FormInputUsername from "../atoms/atom-form-input-username";
import FormInputBirthday from "../atoms/atom-form-input-birthday";
import FormInputEmail from "../atoms/atom-form-input-email";
import FormInputPassword from "../atoms/atom-form-input-password";
import { validateAction } from "@/app/[lang]/signup/actions";
import { ActionButton } from "../atoms/atom-button";
import { ArrowCircleRight, Envelope } from "../icons";

export default function SignupForm ({ lang }: {
    lang: "en" | "es"
}) {
    const [ validateState, validateForm, validatePending ] = useActionState(validateAction, { ok: false, message: "" });
    const [ name, setName ] = useState<string>("");
    const [ username, setUsername ] = useState<string>("");
    const [ birthday, setBirthday ] = useState<Date | null>(null);
    const [ email, setEmail ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");
    const [ confirmation, setConfirmation ] = useState<string>("");
    const [ validated, setValidated ] = useState<boolean>(false);

    useEffect(() => {
        if (validateState.ok) {
            setValidated(true);
        }
    }, [validateState.ok])

    return (
        <section className="w-full sm:w-[400px] p-3 flex flex-col items-center justify-center">
            {
                validated ? <section className="p-10 flex flex-col justify-start items-center">
                    <h3 className="text-center">{ lang === "es" ? "Hemos enviado un enlace a tu correo electrónico." : "A confirmation link has been sent."}</h3>
                    <p className="text-center">{ lang === "es" ? "Por favor sigue las instrucciones para completar el registro. Ya puedes cerrar esta ventana." : "Please check your email and follow the instructions. You may close this tab." }</p>
                    <br></br>
                    <p className="text-center text-[#F5A524]">{ lang === "es" ? "El enlace expirará en 1 minuto." : "The token will expire after 1 minute." }</p>
                    <div className="m-5">
                        <Envelope width={32} height={32} />
                    </div>
                </section> :
                <form className="flex flex-col items-center">
                    <FormInputName name={ name } setName={ setName } />
                    <FormInputUsername username={ username } setUsername={ setUsername } />
                    <FormInputBirthday birthday={ birthday } setBirthday={ setBirthday } />
                    <FormInputEmail email={ email } setEmail={ setEmail } />
                    <FormInputPassword password={ password } confirmation={ confirmation } setPassword={ setPassword } setConfirmation={ setConfirmation } />
                    <p aria-live="polite" className="text-danger text-center">{ validateState.message }</p>
                    <ActionButton 
                    className="bg-white text-black m-3" 
                    type="submit" 
                    disabled={ validatePending } 
                    loading={ validatePending } 
                    formAction={ validateForm }
                    endContent={<ArrowCircleRight />}>
                        { lang === "es" ? "Siguiente" : "Next" }
                    </ActionButton>
                    <SignInProviders lang={ lang.toString() as "en" | "es" } />
                </form>
            }
        </section>
        
    )
}