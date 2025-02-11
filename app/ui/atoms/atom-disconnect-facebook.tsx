"use client"
import { useState } from "react"
import Dialog from "./atom-dialog";
import { ActionButton } from "./atom-button";
import { DisconnectFacebookAction } from "@/app/[lang]/profile/settings/actions";
import { useParams } from "next/navigation";

export default function DisconnectFacebook () {
    const [disconnected, setDisconnected] = useState<boolean>(false);
    const params = useParams();
    const { lang } = params;

    const handleDisconnect = async () => {
        const response = await DisconnectFacebookAction();
        if (response === 200) {
            setDisconnected(true);
        }
    }

    return (
        <>
        {
            !disconnected && <Dialog openTextES="Desconectar de Facebook" openTextEN="Disconnect Facebook">
            <>
            {
                lang === "es" ? 
                <>
                    <p>Es posible que debas también remover el acceso desde tu cuenta de Facebook.</p>
                    <i>Si este es tu único método para iniciar sesión, ya no podrás acceder a esta cuenta.</i>
                </> : 
                <>
                    <p>You may also need to remove access from your Facebook Account.</p>
                    <i>If this is the only signin method you have left, you may not be able to log in.</i>
                    
                </>
            }
            <ActionButton text={ lang === "es" ? "Desconectar" : "Disconnect"} onClick={handleDisconnect} action="disconnect_facebook"/>
            </>
        </Dialog>
        }
        </>
    )
}