"use client"
import { useActionState } from "react"
import { DisconnectFacebookAction } from "@/app/[lang]/dashboard/actions";
import { useParams } from "next/navigation";
import { BreadcrumbItem, Breadcrumbs, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { LogoFacebook } from "../icons";

export default function DisconnectFacebook () {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [ state, action, isLoading ] = useActionState(DisconnectFacebookAction, { message: "" });
    const params = useParams();
    const { lang } = params;

    return (
        <>
        <Button isLoading={ isLoading } isDisabled={ isLoading } className="text-black bg-white border-1 border-black" endContent={<LogoFacebook />} onPress={onOpen}>{ lang === "es" ? "Desconectar Facebook" : "Disconnect from Facebook"}</Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-row items-center justify-center">
                        <h3 className="mr-3">{ lang === "es" ? "Desconectar Facebook" : "Disconnect from Facebook"}</h3>
                        <LogoFacebook />
                    </ModalHeader>
                    <ModalBody>
                    {
                        lang === "es" ? 
                        <>
                            <p>Es posible que debas también revocar el acceso desde tu cuenta de Facebook.</p>
                            <ul className="pl-4 list-decimal">
                                <li>
                                    <Breadcrumbs size="lg">
                                        <BreadcrumbItem>Ve a Ajustes y Privacidad</BreadcrumbItem>
                                        <BreadcrumbItem>Tu Actividad</BreadcrumbItem>
                                        <BreadcrumbItem>Apps y Páginas</BreadcrumbItem>
                                        <BreadcrumbItem>Encuentra la app 'Scheduler' y presiona el botón 'Eliminar'</BreadcrumbItem>
                                    </Breadcrumbs>
                                </li>
                            </ul>
                            <i className="text-danger">Si este es tu único método para iniciar sesión, la cuenta será eliminada permanentemente.</i>
                        </> : 
                        <>
                            <p>You may also need to remove access from your Facebook Account.</p>
                            <ul className="pl-4 list-decimal">
                                <li>
                                    <Breadcrumbs size="lg">
                                        <BreadcrumbItem>Go to Settings & Privacy</BreadcrumbItem>
                                        <BreadcrumbItem>Your Activity</BreadcrumbItem>
                                        <BreadcrumbItem>Apps and websites</BreadcrumbItem>
                                        <BreadcrumbItem>Find the app 'Scheduler' and click on 'Remove'</BreadcrumbItem>
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
                            <Button type="submit" size="md" className="bg-black text-white dark:bg-white dark:text-black" isLoading={ isLoading } isDisabled={ isLoading }>
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