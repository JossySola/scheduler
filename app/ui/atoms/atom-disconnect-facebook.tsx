"use client"
import { useState } from "react"
import { ActionButton, SecondaryButton } from "./atom-button";
import { DisconnectFacebookAction } from "@/app/[lang]/dashboard/actions";
import { useParams } from "next/navigation";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { LogoFacebook } from "geist-icons";

export default function DisconnectFacebook () {
    const [disconnected, setDisconnected] = useState<boolean>(false);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const params = useParams();
    const { lang } = params;

    return (
        <>
        {
            !disconnected ? <Button className="bg-white border-1 border-black" endContent={<LogoFacebook color="#0866ff"/>} onPress={onOpen}>{ lang === "es" ? "Desconectar Facebook" : "Disconnect from Facebook"}</Button> : null
        }
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-row items-center justify-center">
                        <h3 className="mr-3">{ lang === "es" ? "Desconectar Facebook" : "Disconnect from Facebook"}</h3>
                        <LogoFacebook color="#0866ff"/>
                    </ModalHeader>
                    <ModalBody>
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
                    </ModalBody>
                    <ModalFooter className="flex flex-row justify-between items-center">
                        <ActionButton onPress={async () => {
                            const response = await DisconnectFacebookAction();
                            if (response === 200) {
                                setDisconnected(true);
                            }
                        }}>{ lang === "es" ? "Desconectar" : "Disconnect"}
                        </ActionButton>
                        <SecondaryButton onPress={onClose}>{ lang === "es" ? "Cancelar" : "Cancel" }</SecondaryButton>
                    </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
        </>
    )
}