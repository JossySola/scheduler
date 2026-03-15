"use client"
import { FacebookLogo, GoogleLogo, MicrosoftLogo } from "@/ui/icons/geist/icons";
import { Button } from "react-aria-components";
import signInMicrosoft from "../utils/signInMicrosoft/client/signInMicrosoft";
import signInGoogle from "../utils/signInGoogle/client/signInGoogle";
import signInFacebook from "../utils/signInFacebook/client/signInFacebook";

export default function SignInProviders() {
    return (
        <section className="flex flex-col">
            <Button className="provider-button" onClick={e => signInMicrosoft()}><MicrosoftLogo /> Microsoft</Button>
            <Button className="provider-button" onClick={e => signInGoogle()}><GoogleLogo /> Google</Button>
            <Button className="provider-button" onClick={e => signInFacebook()}><FacebookLogo /> Facebook</Button>
        </section>
    )
}