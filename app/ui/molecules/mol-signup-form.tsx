"use client"
import { useState } from "react";
import BasicInformation from "./mol-signup-information";
import ConfirmEmail from "./mol-confirm-email";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function SignupForm () {
    const [ validated , setValidated ] = useState<boolean>(false);
    const params = useParams();
    const { lang } = params;

    return (
        <>
            <form name="register" id="register">
                <BasicInformation validated={validated} setValidated={setValidated} />
                {
                    validated ? <ConfirmEmail /> : <p>{ lang === "es" ? "o si ya tienes una cuenta, " : "Or if you already have an account, "}<Link href={"/login"}>{ lang === "es" ? "Inicia Sesión" : "Login" }</Link></p>
                }
            </form>
        </>
        
    )
}