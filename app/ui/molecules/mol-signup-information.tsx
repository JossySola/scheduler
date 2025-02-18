"use client"
import FormInputBirthday from "../atoms/atom-form-input-birthday";
import FormInputEmail from "../atoms/atom-form-input-email";
import FormInputName from "../atoms/atom-form-input-name";
import FormInputPassword from "../atoms/atom-form-input-password";
import FormInputUsername from "../atoms/atom-form-input-username";
import FormButtonValidation from "../atoms/atom-form-button-validation";
import { SetStateAction } from "react";
import { useParams } from "next/navigation";
import { ArrowCircleRight } from "geist-icons";

export default function BasicInformation ({ validated, setValidated, name, setName, email, setEmail }: { 
    validated: boolean, 
    setValidated: React.Dispatch<SetStateAction<boolean>>,
    name: string,
    setName: React.Dispatch<SetStateAction<string>>,
    email: string,
    setEmail: React.Dispatch<SetStateAction<string>>
}) {
    const params = useParams();
    const { lang } = params;

    return (
        <fieldset hidden={validated} className="w-full sm:w-[400px] p-3 flex flex-col items-center justify-center">
            <FormInputName name={name} setName={setName} />
            <FormInputUsername />
            <FormInputBirthday />
            <FormInputEmail email={email} setEmail={setEmail} />
            <FormInputPassword />
            <FormButtonValidation 
                text={ lang === "es" ? "Siguiente" : "Next" } 
                formName="register" 
                setValidated={setValidated}
                endContent={<ArrowCircleRight />}
            />
        </fieldset>
    )
}