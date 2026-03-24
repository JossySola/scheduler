"use client"
import { authClient } from "../_utils/auth-client";
import PrimaryButton from "../../../../ui/buttons/primary-button";
import { redirect } from "next/navigation";

export default function SignUpButton() {
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
            Sign Up
            </PrimaryButton>
        )
    }
    return null;
}