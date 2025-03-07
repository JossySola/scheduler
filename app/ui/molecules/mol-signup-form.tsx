"use client"
import { useActionState, useEffect, useState } from "react";
import SignInProviders from "./mol-signin-providers";
import { Button, Input } from "@heroui/react";
import FormInputName from "../atoms/atom-form-input-name";
import FormInputUsername from "../atoms/atom-form-input-username";
import FormInputBirthday from "../atoms/atom-form-input-birthday";
import FormInputEmail from "../atoms/atom-form-input-email";
import FormInputPassword from "../atoms/atom-form-input-password";
import { ArrowCircleRight, CheckCircle } from "geist-icons";
import { validateAction, verifyTokenAction } from "@/app/[lang]/signup/actions";
import ExpiringTokenInput from "../atoms/atom-token-input";

export default function SignupForm ({ lang }: {
    lang: "en" | "es"
}) {
    const [ validateState, validateForm, validatePending ] = useActionState(validateAction, { ok: false, message: "" });
    const [ confirmState, confirmAction, confirmPending ] = useActionState(verifyTokenAction, { ok: false, message: "" });
    const [ validated , setValidated ] = useState<boolean>(false);
    const [ name, setName ] = useState<string>("");
    const [ username, setUsername ] = useState<string>("");
    const [ birthday, setBirthday ] = useState<Date | null>(null);
    const [ email, setEmail ] = useState<string>("");
    const [ password, setPassword ] = useState<string>('');
    const [ confirmation, setConfirmation ] = useState<string>('');
    
    useEffect(() => {
        if (validateState && validateState.ok) setValidated(true);
    }, [validateState]);

    return (
        <form id="register" className="w-screen sm:w-[400px] p-5 flex flex-col items-center justify-center">
            <fieldset style={{ display: validated ? "none" : "flexbox" }} className="w-full sm:w-[400px] p-3 flex flex-col items-center justify-center">
                <FormInputName name={ name } setName={ setName } />
                <FormInputUsername username={ username } setUsername={ setUsername } />
                <FormInputBirthday birthday={ birthday } setBirthday={ setBirthday } />
                <FormInputEmail email={ email } setEmail={ setEmail } />
                <FormInputPassword password={ password } confirmation={ confirmation } setPassword={ setPassword } setConfirmation={ setConfirmation } />
                <p aria-live="polite" className="text-danger text-center">{ validateState.message }</p>
                {
                    validateState.descriptive && validateState.descriptive.map((error, index) => {
                        return <p aria-live="polite" className="text-danger text-center" key={index}>{ error.message }</p>
                    })
                }
                <Button 
                className="bg-white text-black m-3" 
                type="submit" 
                isDisabled={ validatePending } 
                isLoading={ validatePending } 
                formAction={ validateForm }
                endContent={<ArrowCircleRight />}>
                    { lang === "es" ? "Siguiente" : "Next" }
                </Button>
                <SignInProviders lang={ lang.toString() as "en" | "es" } />
            </fieldset>
            {
                validated && <fieldset>
                {
                    lang === "es" ? 
                    <>
                    <h4 className="m-2">
                        Hemos enviado a tu correo electrónico un código, por favor ingresalo aquí para verificar tu cuenta.
                    </h4>
                    <br></br>
                    <h4 className="m-2">
                        Recuerda checar la carpeta de <b>Spam</b> si no ves el e-mail en tu <b>Bandeja de Entrada</b>.
                    </h4>
                    </>
                    : 
                    <>
                    <h4 className="m-2">
                        We've sent you an e-mail with a code, please type it here to verify your account.
                    </h4>
                    <br></br>
                    <h4 className="m-2">
                        Remember to check your <b>Junk</b> folder in case you don't see the confirmation e-mail in your <b>Inbox</b>.
                    </h4>
                    </>
                }
                <Input
                minLength={6}
                maxLength={6}
                name="confirmation-token"
                id="confirmation-token"
                variant="flat"
                radius="md"
                size="lg"
                isRequired
                isClearable />
                { validated && <ExpiringTokenInput lang={ lang as "es" | "en" } /> }

                <p aria-live="polite" className="text-danger mt-5">{ confirmState.message }</p>
                <Button
                className="bg-white text-black mt-3"
                type="submit"
                isDisabled={ confirmPending }
                isLoading={ confirmPending }
                formAction={ confirmAction }
                endContent={ <CheckCircle /> }>
                    { lang === "es" ? "Confirmar" : "Confirm" }
                </Button>
                </fieldset>
            }
        </form>
    )
}