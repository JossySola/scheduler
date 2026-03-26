"use client"
import { authClient } from "../_utils/auth-client";
import { redirect } from "next/navigation";
import SecondaryButton from "@/ui/buttons/secondary-button";
import { AuthFormProps } from "@/lib/definitions";

export default function SignInButton({t}: { t: AuthFormProps}) {
    const { data: session } = authClient.useSession();
    const handleSignIn = () => {
        redirect("/signin");
    }
    if (!session) {
        return (
            <SecondaryButton 
            type="button" 
            aria-label="sign in" 
            onPress={handleSignIn}>
            {t.signInBtn}
            </SecondaryButton>
        )
    }
    return null;
}