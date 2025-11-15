"use client"
import DangerButton from "../atoms/atom-danger-button";
import DisconnectGoogle from "../atoms/atom-disconnect-google";
import DisconnectFacebook from "../atoms/atom-disconnect-facebook";
import { redirect } from "next/navigation";
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { SettingsGearFill } from "../icons";
import { SessionProvider } from "next-auth/react";

export default function Settings ({ lang, data, onlyWithProvider }: {
    lang: string,
    data: Array<{ provider: string }>,
    onlyWithProvider: boolean | null,
}) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <SessionProvider>
            <Button isIconOnly aria-label={ lang === "es" ? "Ajustes" : "Settings"} onPress={onOpen}>
                <SettingsGearFill />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {onClose => (
                        <>
                        <ModalHeader className="flex flex-row items-center justify-center">
                            <h3 className="mr-3 text-center">{ lang === "es" ? "Ajustes de Cuenta" : "Account Settings"}</h3>
                        </ModalHeader>
                        <ModalBody className="flex flex-col items-center">
                            {
                                data && data.map((row: { provider: string }) => {
                                    if (row.provider === "google") {
                                        return <DisconnectGoogle key={row.provider} />
                                    }
                                    if (row.provider === "facebook") {
                                        return <DisconnectFacebook key={row.provider} />
                                    }
                                })
                            }
                            <Divider />
                            <div className="flex flex-col gap-1">
                                <Button 
                                className="action-button" 
                                onPress={() => redirect(`${process.env.NEXTAUTH_URL}/${lang}/recover`)}>
                                    { lang === "es" ? "Restaurar contraseña" : "Reset password" }
                                </Button>
                                <DangerButton onlyWithProvider={ onlyWithProvider } />
                            </div>

                        </ModalBody>
                        <ModalFooter>
                            <Button className="secondary-button" onPress={onClose}>{ lang === "es" ? "Cerrar" : "Close" }</Button>
                        </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </SessionProvider>
    )
}