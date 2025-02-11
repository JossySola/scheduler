"use client"
import { useState } from "react"
import Dialog from "./atom-dialog";
import { ActionButton } from "./atom-button";
import { DisconnectGoogleAction } from "@/app/[lang]/profile/settings/actions";
import { useParams } from "next/navigation";

export default function DisconnectGoogle () {
    const [disconnected, setDisconnected] = useState<boolean>(false);
    const params = useParams();
    const { lang } = params;

    const handleDisconnect = async () => {
        const response = await DisconnectGoogleAction();
        if (response === 200) {
            setDisconnected(true);
        }
    }

    return (
        <>
        {
            !disconnected && <Dialog openTextES="Desconectar de Google" openTextEN="Disconnect Google">
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
                        <li><a target="_blank" href="https://myaccount.google.com/connections?filters=3&pli=1">Ve a las apps y servicios con acceso de terceros.</a></li>
                        <li>Selecciona la app o servicio que quieras quitar en la lista de acceso a terceros.</li>
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
            <ActionButton text={ lang === "es" ? "Desconectar" : "Disconnect"} onClick={handleDisconnect} action="disconnect_google" />
            </>
        </Dialog>
        }
        </>
    )
}