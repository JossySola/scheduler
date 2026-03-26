"use client"
import { useRouter } from "next/navigation";
import ActionButton from "@/ui/buttons/action-button";
import { authClient } from "../_utils/auth-client";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function SignOutButton() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const translation = useTranslations("signout-button");
    const handleSignOut = async () => {
        setIsLoading(true);
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => router.push("/signin")
                }
            })
        } catch (error) {
            
        } finally {
            setIsLoading(false);
        }
    }
    if (session) {
        return (
            <ActionButton 
            isDisabled={isLoading}
            type="button" 
            aria-label="sign out"
            onPress={handleSignOut}>
            {translation("button")}
            </ActionButton>
        )
    }
    return null;
}