"use client"
import { useState } from "react";
import BasicInformation from "./mol-signup-information";
import ConfirmEmail from "./mol-confirm-email";

export default function SignupForm () {
    const [ validated , setValidated ] = useState<boolean>(false);

    return (
        <form name="register" id="register">
            <BasicInformation validated={validated} setValidated={setValidated} />
            {
                validated ? <ConfirmEmail /> : null
            }
        </form>
    )
}