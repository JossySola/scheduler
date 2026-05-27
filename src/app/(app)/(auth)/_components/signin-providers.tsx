"use client"
import { FacebookLogo, GoogleLogo, MicrosoftLogo } from "@/ui/icons/geist/icons";
import { Button } from "react-aria-components";
import signInMicrosoft from "../_utils/signInMicrosoft";
import signInGoogle from "../_utils/signInGoogle";
import signInFacebook from "../_utils/signInFacebook";

export default function SignInProviders() {
    return (
        <section className="flex flex-col w-full sm:flex-row">
            <Button type="button" aria-label="Sign in with Google" className="provider-button" onPress={signInGoogle}><GoogleLogo /> Google</Button>
            <Button type="button" aria-label="Sign in with Facebook" className="provider-button" onPress={signInFacebook}><FacebookLogo /> Facebook</Button>
        </section>
    )
}