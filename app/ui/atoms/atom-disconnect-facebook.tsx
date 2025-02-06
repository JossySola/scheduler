"use client"
import { useEffect, useRef, useState } from "react"
import Dialog from "./atom-dialog";
import { Button } from "./atom-button";
import { DisconnectFacebookAction } from "@/app/(routes)/profile/settings/actions";

export default function DisconnectFacebook () {
    const [disconnected, setDisconnected] = useState<boolean>(false);
    const [refAvailable, setRefAvailable] = useState<boolean>(false);
    const dialogElement = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        if (dialogElement.current) {
            setRefAvailable(true);
        }
    }, [refAvailable]);

    const handleDialog = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (dialogElement.current) {
            dialogElement.current.showModal();
        }
    }

    const handleDisconnect = async () => {
        const response = await DisconnectFacebookAction();

        if (response === 200) {
            setDisconnected(true);
            if (dialogElement.current) {
                dialogElement.current.close();
            }
        }
    }

    return (
        <>
        <Dialog ref={dialogElement && dialogElement}>
            <>
            <p>You may also need to remove access from your Facebook Account.</p>
            <i>If this is the only signin method you have left, you may not be able to log in.</i>
            <Button text="Disconnect" callback={handleDisconnect}/>
            </>
        </Dialog>
        {
            refAvailable && !disconnected ? 
                <Button text="Disconnect Facebook" callback={handleDialog}/> :
                null
        }
        </>
    )
}