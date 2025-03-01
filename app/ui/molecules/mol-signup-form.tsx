"use client"
import { useActionState, useEffect, useState } from "react";
import ConfirmEmail from "./mol-confirm-email";
import SignInProviders from "./mol-signin-providers";
import { Button, Form } from "@heroui/react";
import FormInputName from "../atoms/atom-form-input-name";
import FormInputUsername from "../atoms/atom-form-input-username";
import FormInputBirthday from "../atoms/atom-form-input-birthday";
import FormInputEmail from "../atoms/atom-form-input-email";
import FormInputPassword from "../atoms/atom-form-input-password";
import { ArrowCircleRight, CheckCircle } from "geist-icons";
import { verifyTokenAction, validateAction } from "@/app/[lang]/signup/actions";

export default function SignupForm ({ lang }: {
    lang: "en" | "es"
}) {
    const [ validateState, validateForm, validatePending ] = useActionState(validateAction, { ok: false, message: "" });
    const [ confirmState, confirmAction, confirmPending ] = useActionState(verifyTokenAction, { ok: false, message: "" });

    const [ validated , setValidated ] = useState<boolean>(false);

    useEffect(() => {
        if (validateState && validateState.ok) {
            setValidated(true);
        }
    }, [validateState]);
    

    return (
        <Form id="register" className="w-screen sm:w-[400px] p-3 flex flex-col items-center justify-center">
            
            <fieldset style={{ display: validated ? 'none' : 'flexbox' }} className="w-full sm:w-[400px] p-3 flex flex-col items-center justify-center">
                <FormInputName />
                <FormInputUsername />
                <FormInputBirthday />
                <FormInputEmail />
                <FormInputPassword />
                <p aria-live="polite" className="text-danger">{ validateState.message }</p>
                <Button 
                className="bg-white text-black m-3" 
                type="submit" 
                isDisabled={ validatePending } 
                isLoading={ validatePending } 
                formAction={ validateForm }
                endContent={<ArrowCircleRight />}>
                    { lang === "es" ? "Siguiente" : "Next" }
                </Button>
                <SignInProviders lang={ lang.toString() as "en" | "es"} />
            </fieldset>
            {
            validated && 
            <ConfirmEmail lang={ lang }>
                <>
                    <p aria-live="polite" className="text-danger">{ confirmState.message }</p>
                    <Button
                    className="bg-white text-black m-3"
                    type="submit"
                    isDisabled={ confirmPending }
                    isLoading={ confirmPending }
                    formAction={ confirmAction }
                    endContent={ <CheckCircle /> }>
                        { lang === "es" ? "Confirmar" : "Confirm" }
                    </Button>
                </>
            </ConfirmEmail>
            }
        </Form>
    )
}