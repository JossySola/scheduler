"use client"
import { useState } from "react";
import BasicInformation from "./mol-signup-information";
import ConfirmEmail from "./mol-confirm-email";
import Link from "next/link";

export default function SignupForm () {
    const [ validated , setValidated ] = useState<boolean>(false);

    return (
        <>
            <form name="register" id="register">
                <BasicInformation validated={validated} setValidated={setValidated} />
                {
                    validated ? <ConfirmEmail /> : <p>Or if you already have an account, <Link href={"/login"}>Login</Link></p>
                }
            </form>
        </>
        
    )
}