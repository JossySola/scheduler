'use client'
import Link from "next/link";
import { SubmitButton } from "../atoms/atom-button";
import useReCAPTCHA from "@/app/lib/recaptcha/client-recaptcha";
import { useState } from "react";


export default function SignUp_Conditioned () {
    const { error, isSubmitting, windowIsLoaded, signupCAPTCHA } = useReCAPTCHA();
    const [ reveal, setReveal ] = useState<boolean>(false);
    const [ length, setLength ] = useState<boolean>(false);
    const [ capital, setCapital ] = useState<boolean>(false);
    const [ number, setNumber ] = useState<boolean>(false);
    const [ char, setChar ] = useState<boolean>(false);
    
    if (!windowIsLoaded) {
        return <p>Loading...</p>
    } else {
        return (
            <section>
                <form onSubmit={signupCAPTCHA} method="POST" className="flex-col" aria-describedby="form-error">
                    <div id="form-error" aria-live="polite" aria-atomic="true">
                        {
                            error && <p>{error}</p>
                        }
                    </div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" minLength={3} maxLength={30} required />

                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" minLength={3} maxLength={15} required />

                    <label htmlFor="birthday">Birthday:</label>
                    <input type="date" id="birthday" name="birthday" max="2012-12-31" required />

                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" placeholder="example@domain.com" required />

                    <fieldset>
                        <label htmlFor="password">Set a password:</label>
                        <input type={reveal ? "text" : "password"} id="password" name="password" minLength={8} required onChange={(e) => {
                            const value = e.target.value;
                            setLength(value.length >= 8);
                            setCapital(/[A-Z]/.test(value));
                            setNumber(/[0-9]/.test(value));
                            setChar(/[!@#$%^&*(),.?":{}|<>\-_']/g.test(value));
                        }}/>
                        <button type="button" onClick={() => {
                            setReveal(!reveal);
                        }}>Reveal</button>
                        <section>
                            <p>{length ? '✔️' : '❌'} Has at least 8 characters</p>
                            <p>{capital ? '✔️' : '❌'} Has at least 1 capital letter</p>
                            <p>{number ? '✔️' : '❌'} Has at least 1 number</p>
                            <p>{char ? '✔️' : '❌'} Has at least 1 of the following special characters: <span>! @ # $ % ^ & * , . ? " : | - _ '</span></p>
                        </section>

                        <label htmlFor="confirmpwd">Confirm password:</label>
                        <input type={reveal ? "text" : "password"} id="confirmpwd" name="confirmpwd" minLength={8} required />
                    </fieldset>
                    
                    <SubmitButton text={isSubmitting ? "Submitting..." : "Submit"} disabled={isSubmitting}/>
                </form>
                <Link href="#">Forgot Password</Link>
            </section>
        )
    }
}