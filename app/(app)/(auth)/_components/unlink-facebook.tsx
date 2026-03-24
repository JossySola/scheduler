"use client"
import { FacebookLogo } from "@/ui/icons/geist/icons";
import { Button } from "react-aria-components";
import { authClient } from "../_utils/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UnlinkFacebook() {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { refetch } = authClient.useSession();
    const handleUnlink = async () => {
        setIsLoading(true);
        try {
            await authClient.unlinkAccount({ providerId: 'facebook' });
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
        aria-label="Unlink Facebook account"
        className="provider-button"
        onPress={ handleUnlink } >
        <FacebookLogo /> { isLoading ? "Disconnecting..." : "Disconnect from Facebook" } 
        </Button> 
        {
            message && <p role="alert"> { message } </p>
        } 
        </>
    );
}