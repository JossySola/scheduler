"use client"
import {
    Modal,
    ModalContent,
    ModalBody,
    ModalFooter,
    useDisclosure,
  } from "@heroui/react";
import { SecondaryButton } from "./atom-button";
import { useParams } from "next/navigation";

export default function Dialog ({ children, openTextES, openTextEN }: {
    children: React.JSX.Element,
    openTextES: string,
    openTextEN: string,
}) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const params = useParams();
    const { lang } = params;

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {onClose => (
                        <>
                            <ModalBody>
                                { children }
                            </ModalBody>
                            <ModalFooter>
                                <SecondaryButton text={ lang === "es" ? "Cancelar" : "Cancel" } callback={onClose} />
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <SecondaryButton text={ lang === "es" ? openTextES : openTextEN} callback={onOpen}/>
        </>
    )
}