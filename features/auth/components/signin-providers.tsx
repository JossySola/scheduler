"use client"
import { FacebookLogo, GoogleLogo, MicrosoftLogo } from "@/ui/icons/geist/icons";
import { Button } from "react-aria-components";
import signInMicrosoft from "../utils/signInMicrosoft";
import signInGoogle from "../utils/signInGoogle";
import signInFacebook from "../utils/signInFacebook";

export default function SignInProviders() {
    return (
        <section className="flex flex-col w-full sm:flex-row">
            <Button type="button" aria-label="Sign in with Microsoft" className="provider-button" onClick={e => signInMicrosoft()}><MicrosoftLogo /> Microsoft</Button>
            <Button type="button" aria-label="Sign in with Google" className="provider-button" onClick={e => signInGoogle()}><GoogleLogo /> Google</Button>
            <Button type="button" aria-label="Sign in with Facebook" className="provider-button" onClick={e => signInFacebook()}><FacebookLogo /> Facebook</Button>
        </section>
    )
}