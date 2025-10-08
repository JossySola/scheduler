"use client"
import { useActionState } from "react"
import { DisconnectGoogleAction } from "@/app/[lang]/dashboard/actions";
import { useParams } from "next/navigation";
import { BreadcrumbItem, Breadcrumbs, Button, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { LogoGoogle } from "../icons";

export default function DisconnectGoogle () {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [ state, action, isLoading ] = useActionState(DisconnectGoogleAction, { message: "" });
    const params = useParams();
    const { lang } = params;

    return (
        <>
        <Button isLoading={ isLoading } isDisabled={ isLoading } className="provider-button" endContent={<LogoGoogle />} onPress={onOpen}>{ lang === "es" ? "Desconectar Google" : "Disconnect from Google" }</Button>
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
                            <i className="text-danger">Si este es tu único método para iniciar sesión, la cuenta será eliminada permanentemente.</i>
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
                            <i className="text-danger">If this is the only sign in method you have, the account will be completely and permanently deleted.</i>
                        </>
                    }
                    </ModalBody>
                    <ModalFooter className="flex flex-col justify-center items-center gap-3">
                        <p className="text-danger text-tiny">{ state.message }</p>
                        <form action={action}>
                            <Button type="submit" size="md" className="action-button" isLoading={ isLoading } isDisabled={ isLoading }>
                                { lang === "es" ? "Desconectar" : "Disconnect"}
                            </Button>
                        </form>
                        <Button size="md" variant="bordered" onPress={onClose}>{ lang === "es" ? "Cancelar" : "Cancel" }</Button>
                    </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
        </>
    )
}