"use client"
import { authClient } from "../_utils/auth-client";
import { redirect } from "next/navigation";
import SecondaryButton from "@/ui/buttons/secondary-button";
import { useTranslations } from "next-intl";

export default function SignInButton() {
    const { data: session } = authClient.useSession();
    const translation = useTranslations("signin-button");
    const handleSignIn = () => {
        redirect("/signin");
    }
    if (!session) {
        return (
            <SecondaryButton 
            type="button" 
            aria-label="sign in" 
            onPress={handleSignIn}>
            {translation("button")}
            </SecondaryButton>
        )
    }
    return null;
}