"use client"
import { useState } from "react"
import { ActionButton, SecondaryButton } from "./atom-button";
import { DisconnectGoogleAction } from "@/app/[lang]/dashboard/actions";
import { useParams } from "next/navigation";
import { BreadcrumbItem, Breadcrumbs, Button, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { LogoGoogle } from "../icons";

export default function DisconnectGoogle () {
    const [disconnected, setDisconnected] = useState<boolean>(false);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const params = useParams();
    const { lang } = params;

    return (
        <>
        {
            !disconnected ? <Button className="text-black bg-white border-1 border-black" endContent={<LogoGoogle />} onPress={onOpen}>{ lang === "es" ? "Desconectar Google" : "Disconnect from Google" }</Button> : null
        }
        
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-row items-center justify-center">
                        <h3 className="mr-3">{ lang === "es" ? "Desconectar Google " : "Disconnect from Google " }</h3>
                        <LogoGoogle />
                    </ModalHeader>
                    <ModalBody>
                    {
                        lang === "es" ? 
                        <p>Es posible que necesites también remover el acceso desde tu cuenta de Google:</p> :
                        <p>You may also need to remove access from your Google Account:</p>
                    }
                    {
                        lang === "es" ? 
                        <>
                            <ul className="pl-8 list-decimal">
                                <li><Link href="https://myaccount.google.com/connections?filters=3&pli=1" color="foreground" underline="always" isExternal showAnchorIcon>Ve a las apps y servicios con acceso de terceros.</Link></li>
                                <li>Selecciona la app o servicio que quieras quitar en la lista de acceso a terceros.</li>
                                <li>
                                    <Breadcrumbs size="lg">
                                        <BreadcrumbItem>Ver detalles</BreadcrumbItem>
                                        <BreadcrumbItem>Remover Acceso</BreadcrumbItem>
                                        <BreadcrumbItem>Confirmar</BreadcrumbItem>
                                    </Breadcrumbs>
                                </li>
                            </ul>
                            <i>Si este es tu único método para iniciar sesión, ya no podrás acceder a esta cuenta.</i>
                        </> : 
                        <>
                            <ul className="pl-8 list-decimal">
                                <li><Link href="https://myaccount.google.com/connections?filters=3&pli=1" color="foreground" underline="always" isExternal showAnchorIcon>View the apps and services with third-party access.</Link></li>
                                <li>Select the third-party app or service from the list whose connection you want to remove.</li>
                                <li>
                                    <Breadcrumbs size="lg">
                                        <BreadcrumbItem>See details</BreadcrumbItem>
                                        <BreadcrumbItem>Remove Access</BreadcrumbItem>
                                        <BreadcrumbItem>Confirm</BreadcrumbItem>
                                    </Breadcrumbs>
                                </li>
                            </ul>
                            <i>If this is the only signin method you have left, you may not be able to log in.</i>
                        </>
                    }
                    </ModalBody>
                    <ModalFooter className="flex flex-row justify-between items-center">
                        <ActionButton onPress={async () => {
                            const response = await DisconnectGoogleAction();
                            if (response === 200) {
                                setDisconnected(true);
                            }
                        }}>
                            { lang === "es" ? "Desconectar" : "Disconnect"}
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