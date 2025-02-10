"use client"
import { useEffect, useRef, useState } from "react"
import Dialog from "./atom-dialog";
import { Button } from "./atom-button";
import { DisconnectFacebookAction } from "@/app/[lang]/profile/settings/actions";
import { useParams } from "next/navigation";

export default function DisconnectFacebook () {
    const [disconnected, setDisconnected] = useState<boolean>(false);
    const [refAvailable, setRefAvailable] = useState<boolean>(false);
    const dialogElement = useRef<HTMLDialogElement | null>(null);
    const params = useParams();
    const { lang } = params;

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
            {
                lang === "es" ? 
            <>
                <p>Es posible que debas también remover el acceso desde tu cuenta de Facebook.</p>
                <i>Si este es tu único método para iniciar sesión, ya no podrás acceder a esta cuenta.</i>
                <Button text={ lang === "es" ? "Desconectar" : "Disconnect"} callback={handleDisconnect}/>
            </> : 
            <>
                <p>You may also need to remove access from your Facebook Account.</p>
                <i>If this is the only signin method you have left, you may not be able to log in.</i>
                <Button text={ lang === "es" ? "Desconectar" : "Disconnect"} callback={handleDisconnect}/>
            </>
            }
            
        </Dialog>
        {
            refAvailable && !disconnected ? 
                <Button text={ lang === "es" ? "Desconectar de Facebook" : "Disconnect Facebook"} callback={handleDialog}/> :
                null
        }
        </>
    )
}