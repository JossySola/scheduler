'use client'
import Link from "next/link";
import { SubmitButton } from "../atoms/atom-button";
import useReCAPTCHA from "@/app/lib/recaptcha";


export default function SignUp_Conditioned () {
    const { isSubmitting, windowIsLoaded, signupCAPTCHA } = useReCAPTCHA('signup');
    
    if (!windowIsLoaded) {
        return <p>Loading...</p>
    } else {
        return (
            <section>
                <form onSubmit={signupCAPTCHA} method="POST" className="flex-col">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" minLength={3} maxLength={30} required />

                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" minLength={3} maxLength={15} required />

                    <label htmlFor="birthday">Birthday:</label>
                    <input type="date" id="birthday" name="birthday" required />

                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" placeholder="example@domain.com" required />

                    <label htmlFor="password">Set a password:</label>
                    <input type="password" id="password" name="password" minLength={8} required />

                    <label htmlFor="confirmpwd">Confirm password:</label>
                    <input type="password" id="confirmpwd" name="confirmpwd" minLength={8} required />
                    
                    <SubmitButton text="Sign Up" />
                </form>
                <Link href="#">Forgot Password</Link>
            </section>
        )
    }
}