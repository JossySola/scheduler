"use client"
import { FacebookLogo } from "@/ui/icons/geist/icons";
import { Button } from "react-aria-components";
import { authClient } from "../_utils/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UnlinkProviderProps } from "@/lib/definitions";

export default function UnlinkFacebook({t}: {t: UnlinkProviderProps}) {
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
            setMessage(t.success);
        } catch (error: any) {
            setMessage(error.error.message || t.error)
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
        <FacebookLogo /> { isLoading ? t.state : t.text } 
        </Button> 
        {
            message && <p role="alert"> { message } </p>
        } 
        </>
    );
}