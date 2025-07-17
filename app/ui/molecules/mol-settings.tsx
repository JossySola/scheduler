"use client"
import DangerButton from "../atoms/atom-danger-button";
import DisconnectGoogle from "../atoms/atom-disconnect-google";
import DisconnectFacebook from "../atoms/atom-disconnect-facebook";
import { ActionButton, SecondaryButton } from "../atoms/atom-button";
import { redirect } from "next/navigation";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
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
                            <ActionButton onPress={() => redirect(`${process.env.NEXT_PUBLIC_ORIGIN}/${lang}/recover`)}>{ lang === "es" ? "Restaurar contraseña" : "Reset password" }</ActionButton>
                            <DangerButton onlyWithProvider={ onlyWithProvider } />
                        </ModalBody>
                        <ModalFooter>
                            <SecondaryButton onPress={onClose}>{ lang === "es" ? "Cerrar" : "Close" }</SecondaryButton>
                        </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </SessionProvider>
    )
}