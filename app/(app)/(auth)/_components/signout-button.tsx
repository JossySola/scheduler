"use client"
import { useRouter } from "next/navigation";
import ActionButton from "@/ui/buttons/action-button";
import { authClient } from "../_utils/auth-client";
import { useState } from "react";

export default function SignOutButton() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data: session } = authClient.useSession();
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
            Sign Out
            </ActionButton>
        )
    }
    return null;
}