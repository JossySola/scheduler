'use client'
import Link from "next/link";
import { SubmitButton } from "../atoms/atom-button";
import useReCAPTCHA from "@/app/lib/recaptcha/client-recaptcha";
import { useState } from "react";
import ConfirmEmail from "../molecules/mol-confirm-email";


export default function SignUp_Conditioned () {
    const { 
        status, 
        isSubmitting, 
        windowIsLoaded, 
        signupCAPTCHA, 
        pendingVerification
    } = useReCAPTCHA();
    const [ reveal, setReveal ] = useState<boolean>(false);
    const [ length, setLength ] = useState<boolean>(false);
    const [ email, setEmail ] = useState<string>('');
    
    if (!windowIsLoaded) {
        return <p>Loading...</p>
    } else if (!pendingVerification) {
        return (
            <section>
                <form onSubmit={signupCAPTCHA} method="POST" className="flex-col" aria-describedby="form-error">
                    <div id="form-error" aria-live="polite" aria-atomic="true">
                        {
                            status && <p>{status}</p>
                        }
                    </div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" minLength={3} maxLength={30} autoComplete="name" required />

                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" minLength={3} maxLength={15} required />

                    <label htmlFor="birthday">Birthday:</label>
                    <input type="date" id="birthday" name="birthday" max="2012-12-31" required />

                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" placeholder="example@domain.com" autoComplete="email" required 
                    onChange={(event) => {
                        event.preventDefault();
                        setEmail(event.target.value);
                    }}/>

                    <fieldset>
                        <label htmlFor="password">Set a password:</label>
                        <input type={reveal ? "text" : "password"} id="password" name="password" minLength={8} onChange={(e) => {
                            const value = e.target.value;
                            setLength(value.length >= 8);
                        }} autoComplete="new-password" required/>
                        <button type="button" onClick={() => {
                            setReveal(!reveal);
                        }}>Reveal</button>
                        <section>
                            <p>{length ? '✔️' : '❌'} Has at least 8 characters</p>
                        </section>

                        <label htmlFor="confirmpwd">Confirm password:</label>
                        <input type={reveal ? "text" : "password"} id="confirm-new-password" name="confirmpwd" autoComplete="new-password" minLength={8} required />
                    </fieldset>
                    
                    <SubmitButton text={isSubmitting ? "Submitting..." : "Submit"} disabled={isSubmitting}/>
                </form>
                <Link href="#">Forgot Password</Link>
            </section>
        )
    } else if (pendingVerification) {
        return <ConfirmEmail email={email}/>
    }
}