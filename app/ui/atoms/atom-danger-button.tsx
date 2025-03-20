"use client"
import { useActionState, useState } from "react"
import { ActionButton, SecondaryButton } from "./atom-button";
import { DeleteAccountAction } from "@/app/[lang]/dashboard/actions";
import { useParams } from "next/navigation";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Form,
    Input,
  } from "@heroui/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "./atom-eyeslash";

export default function DangerButton () {
    const [ deleteState, deleteAction, pending] = useActionState(DeleteAccountAction, { message: "" });
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [ isVisible, setIsVisible ] = useState<boolean>(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const params = useParams();
    const { lang } = params;
    
    return (
        <>
        <ActionButton color="danger" onPress={onOpen}>{ lang === "es" ? "Eliminar cuenta" : "Delete account"}</ActionButton>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} >
                <ModalContent>
                    {onClose => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-center">
                                <h3 className="text-danger">{ lang === "es" ? "¡Advertencia!" : "Warning!"}</h3>
                            </ModalHeader>
                            <ModalBody className="flex flex-col justify-center items-center">
                                <Form action={deleteAction} className="m-5 flex flex-col items-center">
                                    <Input 
                                    isRequired
                                    size="lg"
                                    type={isVisible ? "text" : "password"}
                                    autoComplete="current-password"
                                    errorMessage={ lang === "es" ? "Ingresa tu contraseña para confirmar" : "Enter your password to confirm" }
                                    label={ lang === "es" ? "Confirma esta acción ya que ésta será permanente e irreversible:" : "Confirm this action as this will be irreversible:" }
                                    labelPlacement="outside" 
                                    placeholder={ lang === "es" ? "Ingresa tu contraseña" : "Enter your password" }
                                    validate={() => {
                                        if (deleteState && deleteState.message) {
                                            return deleteState.message;
                                        }
                                    }} 
                                    endContent={
                                     <button 
                                        aria-label="toggle password visibility"
                                        className="focus:outline-none"
                                        type="button"
                                        onClick={toggleVisibility}
                                     >
                                        { isVisible ? (
                                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        ) : (
                                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        )}
                                     </button>   
                                    }/>
                                    <ActionButton loading={pending} disabled={pending} type="submit">{ lang === "es" ? "Confirmar" : "Confirm"}</ActionButton>
                                    
                                </Form>
                            </ModalBody>
                            <ModalFooter>
                                <SecondaryButton onPress={onClose}>{ lang === "es" ? "Cancelar" : "Cancel" }</SecondaryButton>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
        </Modal>
        </>
    )
}