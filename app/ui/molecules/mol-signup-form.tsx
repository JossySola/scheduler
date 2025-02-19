"use client"
import { useActionState, useEffect, useState } from "react";
import ConfirmEmail from "./mol-confirm-email";
import { useParams } from "next/navigation";
import SignInProviders from "./mol-signin-providers";
import { Button, Form } from "@heroui/react";
import FormInputName from "../atoms/atom-form-input-name";
import FormInputUsername from "../atoms/atom-form-input-username";
import FormInputBirthday from "../atoms/atom-form-input-birthday";
import FormInputEmail from "../atoms/atom-form-input-email";
import FormInputPassword from "../atoms/atom-form-input-password";
import { ArrowCircleRight, CheckCircle } from "geist-icons";
import { confirmEmailAction, validateAction } from "@/app/[lang]/signup/actions";

export default function SignupForm () {
    const [ validateState, validateForm, validatePending ] = useActionState(validateAction, { message: "", passes: false });
    const [ confirmState, confirmAction, confirmPending ] = useActionState(confirmEmailAction, { ok: false, message: '' });

    const [ validated , setValidated ] = useState<boolean>(false);
    const [ email, setEmail ] = useState<string>("");
    const [ name, setName ] = useState<string>("");

    const params = useParams();
    const lang = params.lang ? params.lang : "en";

    useEffect(() => {
        if (validateState && validateState.passes === true) {
            setValidated(true);
        }
    }, [validateState])

    return (
        <Form id="register" className="w-screen sm:w-[400px] p-3 flex flex-col items-center justify-center">
            <h2 className="tracking-tight">{ lang === "es" ? "Regístrate" : "Create an account" }</h2>
            
            <fieldset style={{ display: validated ? 'none' : 'flexbox' }} className="w-full sm:w-[400px] p-3 flex flex-col items-center justify-center">
                <FormInputName name={name} setName={setName} />
                <FormInputUsername />
                <FormInputBirthday />
                <FormInputEmail email={email} setEmail={setEmail} />
                <FormInputPassword />
                <p aria-live="polite" className="text-danger">{validateState.message}</p>
                <Button 
                className="bg-white text-black m-3" 
                type="submit" 
                isDisabled={validatePending} 
                isLoading={validatePending} 
                formAction={validateForm}
                endContent={<ArrowCircleRight />}>
                    { lang === "es" ? "Siguiente" : "Next" }
                </Button>
                <SignInProviders lang={ lang.toString() } />
            </fieldset>
                
            {
                validated && <ConfirmEmail name={name} email={email}>
                    <>
                    <p aria-live="polite" className="text-danger">{confirmState.message}</p>
                    <Button
                    className="bg-white text-black m-3"
                    type="submit"
                    isDisabled={confirmPending}
                    isLoading={confirmPending}
                    formAction={confirmAction}
                    endContent={<CheckCircle />}>
                        { lang === "es" ? "Confirmar" : "Confirm" }
                    </Button>
                    </>
                </ConfirmEmail>
            }
        </Form>
    )
}