"use client"
import { useActionState, useState } from "react"
import { SecondaryButton, SubmitButton } from "./atom-button";
import { DeleteAccountAction } from "@/app/[lang]/profile/settings/actions";
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
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} >
                <ModalContent>
                    {onClose => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{ lang === "es" ? "Advertencia:" : "Warning!"}</ModalHeader>
                            <ModalBody>
                                <Form action={deleteAction}>
                                    <Input 
                                    isRequired
                                    size="lg"
                                    type={isVisible ? "text" : "password"}
                                    autoComplete="current-password"
                                    errorMessage={ lang === "es" ? "Ingresa tu contraseña para confirmar" : "Enter your password to confirm" }
                                    label={ lang === "es" ? "Confirma esta acción ya que ésta no será reversible:" : "Confirm this action as this will be irreversible:" }
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
                                    <SubmitButton text="Confirm" disabled={pending} color="danger"/>
                                    <SecondaryButton text={ lang === "es" ? "Cancelar" : "Cancel" } callback={onClose} />
                                </Form>
                            </ModalBody>
                            <ModalFooter>
                                
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
        </Modal>
        
        <SecondaryButton text={ lang === "es" ? "Eliminar cuenta" : "Delete account"} callback={onOpen} />
        </>
    )
}