"use client"
import { GoogleLogo } from "@/ui/icons/geist/icons";
import { Button } from "react-aria-components";
import { authClient } from "../_utils/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UnlinkGoogle() {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { refetch } = authClient.useSession();
    const handleUnlink = async () => {
        setIsLoading(true);
        try {
            await authClient.unlinkAccount({ providerId: 'google' });
            await refetch();
            router.refresh();
            setMessage("Disconnected successfully");
        } catch (error: any) {
            setMessage(error.error.message || "Failed to disconnect")
        } finally {
            setIsLoading(false);
        }
    }
	return ( 
        <>
		<Button 
        type="button"
		isDisabled={ isLoading } 
        aria-label="Unlink Google account"
		className="provider-button"
		onPress={ handleUnlink } >
		<GoogleLogo /> { isLoading ? "Disconnecting..." : "Disconnect from Google" } 
        </Button> 
        {
			message && <p role="alert"> { message } </p>
        } 
        </>
	);
}