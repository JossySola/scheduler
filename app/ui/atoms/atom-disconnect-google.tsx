"use client"
import { useEffect, useRef, useState } from "react"
import Dialog from "./atom-dialog";
import { Button } from "./atom-button";
import { DisconnectGoogleAction } from "@/app/[lang]/profile/settings/actions";
import { useParams } from "next/navigation";

export default function DisconnectGoogle () {
    const [disconnected, setDisconnected] = useState<boolean>(false);
    const [refAvailable, setRefAvailable] = useState<boolean>(false);
    const dialogElement = useRef<HTMLDialogElement | null>(null);
    const params = useParams();
    const { lang } = params;

    useEffect(() => {
        if (dialogElement.current) {
            setRefAvailable(true);
        }
    }, [refAvailable])

    const handleDialog = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (dialogElement.current) {
            dialogElement.current.showModal();
        }
    }

    const handleDisconnect = async () => {
        const response = await DisconnectGoogleAction();
        
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
            {
                lang === "es" ? 
                <p>Es posible que necesites también remover el acceso desde tu cuenta de Google</p> :
                <p>You may also need to remove access from your Google Account.</p>
            }
            {
                lang === "es" ? 
                <>
                <ul>
                    <li><a target="_blank" href="https://myaccount.google.com/connections?filters=3&pli=1">Ve las apps y servicios con acceso de terceros.</a></li>
                    <li>Selecciona la app o servicio con acceso de terceros en la lista la cual quieras quitar.</li>
                    <li>Selecciona 'Ver detalles' &gt; 'Remover Acceso' &gt; 'Confirmar'.</li>
                </ul>
                <i>Si este es tu único método para iniciar sesión, ya no podrás acceder a esta cuenta.</i>
                </> : 
                <>
                <ul>
                    <li><a target="_blank" href="https://myaccount.google.com/connections?filters=3&pli=1">View the apps and services with third-party access.</a></li>
                    <li>Select the third-party app or service from the list whose connection you want to remove.</li>
                    <li>Select See details &gt; Remove Access &gt; Confirm.</li>
                </ul>
                <i>If this is the only signin method you have left, you may not be able to log in.</i>
                </>
            }
            
            
            <Button text={ lang === "es" ? "Desconectar" : "Disconnect"} callback={handleDisconnect}/>
            </>
        </Dialog>
        {
            refAvailable && !disconnected ? 
                <Button text={ lang === "es" ? "Desconectar de Google" : "Disconnect Google"} callback={handleDialog}/> :
                null
        }
        </>
    )
}