"use client"
import { authClient } from "../_utils/auth-client";
import { redirect } from "next/navigation";
import SecondaryButton from "../../../../ui/buttons/secondary-button";

export default function SignInButton() {
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
            Sign In
            </SecondaryButton>
        )
    }
    return null;
}