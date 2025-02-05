"use client"
import FormInputBirthday from "../atoms/atom-form-input-birthday";
import FormInputEmail from "../atoms/atom-form-input-email";
import FormInputName from "../atoms/atom-form-input-name";
import FormInputPassword from "../atoms/atom-form-input-password";
import FormInputUsername from "../atoms/atom-form-input-username";
import FormButtonValidation from "../atoms/atom-form-button-validation";
import { SetStateAction } from "react";

export default function BasicInformation ({
    validated,
    setValidated,
}: { validated: boolean, setValidated: React.Dispatch<SetStateAction<boolean>>}) {
    return (
        <fieldset hidden={validated}>
            <FormInputName />
            <FormInputUsername />
            <FormInputBirthday />
            <FormInputEmail />
            <FormInputPassword />
            <FormButtonValidation text="Next" formName="register" setValidated={setValidated}/>
        </fieldset>
    )
}