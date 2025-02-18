"use client"
import { useState } from "react";
import BasicInformation from "./mol-signup-information";
import ConfirmEmail from "./mol-confirm-email";
import { useParams } from "next/navigation";
import SignInProviders from "./mol-signin-providers";

export default function SignupForm () {
    const [ validated , setValidated ] = useState<boolean>(false);
    const [ email, setEmail ] = useState<string>("");
    const [ name, setName ] = useState<string>("");
    const params = useParams();
    const { lang } = params;

    return (
        <form name="register" id="register" className="w-screen sm:w-[400px] p-3 flex flex-col items-center justify-center">
            <h2 className="tracking-tight">{ lang === "es" ? "Regístrate" : "Create an account" }</h2>
            
            {
                validated ? 
                <ConfirmEmail name={name} email={email} /> : 
                lang && (
                <>
                <BasicInformation 
                validated={ validated } 
                setValidated={ setValidated } 
                email={ email }
                name={ name }
                setEmail={ setEmail }
                setName={ setName } />
                <SignInProviders lang={ lang.toString() } />
                </>
                )
            }
        </form>
    )
}