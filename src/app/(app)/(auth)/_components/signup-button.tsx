"use client"
import PrimaryButton from "@/ui/buttons/primary-button";
import { authClient } from "../_utils/auth-client";
import { redirect } from "next/navigation";
import { AuthFormProps } from "@/lib/definitions";

export default function SignUpButton({t}: {t: AuthFormProps}) {
    const { data: session } = authClient.useSession();
    const handleSignUp = () => {
        redirect("/signup");
    }    
    if (!session) {
        return (
            <PrimaryButton 
            type="button" 
            aria-label="sign up" 
            onPress={handleSignUp}>
            {t.signUpBtn}
            </PrimaryButton>
        )
    }
    return null;
}