'use client'
import { SignUpAction } from "@/app/(routes)/signup/actions";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import Link from "next/link";
import ReCAPTCHA from "../atoms/ReCAPTCHA";


export default function SignUp () {

    return (
        <GoogleReCaptchaProvider reCaptchaKey="6LfEx5EqAAAAAN3Ri6bU8BynXkRlTqh6l6mHbl4t">
            <form className="flex-col">
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
                <ReCAPTCHA text="Sign Up" formAction={SignUpAction} action="signup"/>
            </form>
            <Link href="#">Forgot Password</Link>
        </GoogleReCaptchaProvider>
    )
}