"use client"
import { useRouter } from "next/navigation";
import ActionButton from "@/ui/buttons/action-button";
import { authClient } from "@/features/auth/utils/auth-client";

export default function SignOutButton() {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    if (session) {
        return <ActionButton 
        type="button" 
        aria-label="sign out"
        onClick={async (e) => {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/signin");
                    }
                }
            })
        }}>
        Sign Out
        </ActionButton>
    }
    return null;
}