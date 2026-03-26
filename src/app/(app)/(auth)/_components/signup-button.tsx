"use client"
import PrimaryButton from "@/ui/buttons/primary-button";
import { authClient } from "../_utils/auth-client";
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";

export default function SignUpButton() {
    const { data: session } = authClient.useSession();
    const translation = useTranslations("signup-button");
    const handleSignUp = () => {
        redirect("/signup");
    }    
    if (!session) {
        return (
            <PrimaryButton 
            type="button" 
            aria-label="sign up" 
            onPress={handleSignUp}>
            {translation("button")}
            </PrimaryButton>
        )
    }
    return null;
}