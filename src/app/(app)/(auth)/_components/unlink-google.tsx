"use client"
import { GoogleLogo } from "@/ui/icons/geist/icons";
import { Button } from "react-aria-components";
import { authClient } from "../_utils/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function UnlinkGoogle() {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { refetch } = authClient.useSession();
    const translation = useTranslations("unlink-google");
    const handleUnlink = async () => {
        setIsLoading(true);
        try {
            await authClient.unlinkAccount({ providerId: 'google' });
            await refetch();
            router.refresh();
            setMessage(translation("success"));
        } catch (error: any) {
            setMessage(error.error.message || translation("error"))
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
		<GoogleLogo /> { isLoading ? translation("state") : translation("text") } 
        </Button> 
        {
			message && <p role="alert"> { message } </p>
        } 
        </>
	);
}