"use client"
import { useActionState, useState } from "react";
import { DeleteAccount_NoPassword, DeleteAccountAction } from "@/app/[lang]/dashboard/actions";
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
    Button,
} from "@heroui/react";
import { useSession } from "next-auth/react";
import { Eye, EyeOff } from "../icons";

export default function DangerButton ({ onlyWithProvider }: { onlyWithProvider: boolean | null }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const params = useParams();
    const { lang } = params;
    return (
        <>
        <Button 
        color="danger"
        onPress={ onOpen }>
            { lang === "es" ? "Eliminar cuenta" : "Delete account" }
        </Button>
        <Modal isOpen={ isOpen } onOpenChange={ onOpenChange } >
                <ModalContent>
                    {onClose => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-center">
                                <h3 className="text-danger">{ lang === "es" ? "¡Advertencia!" : "Warning!" }</h3>
                            </ModalHeader>
                            <ModalBody className="flex flex-col justify-center items-center">
                                <Confirmation onlyWithProvider={ onlyWithProvider }/>
                            </ModalBody>
                            <ModalFooter>
                                <Button className="secondary-button" onPress={ onClose }>{ lang === "es" ? "Cancelar" : "Cancel" }</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
        </Modal>
        </>
    )
}

function Confirmation ({ onlyWithProvider }: { onlyWithProvider: boolean | null }) {
    const [ deleteState, deleteAction, pending] = useActionState(DeleteAccountAction, { message: "" });
    const [ noPasswordState, noPasswordAction, isLoading ] = useActionState(DeleteAccount_NoPassword, { message: "" });
    const [ password, setPassword ] = useState<string>("");
    const [ isVisible, setIsVisible ] = useState<boolean>(false);
    const params = useParams();
    const { lang } = params;
    const { data: session } = useSession();
    const toggleVisibility = () => setIsVisible(!isVisible);

    if (session && session.user && session.user.id) {
        if (onlyWithProvider === null) {
            return null;
        }
        if (onlyWithProvider === true) {
            return (
                <section className="flex flex-col justify-center items-center gap-3">
                    <p className="text-danger text-2xl text-center">{ lang === "es" ? "Esta acción es permanente e irreversible" : "This action is permanent and irreversible" }</p>
                    <p className="text-danger text-center">{ noPasswordState && noPasswordState.message }</p>
                    <Button 
                    isLoading={ isLoading } 
                    isDisabled={ isLoading } 
                    size="md"
                    className="action-button"
                    onPress={ noPasswordAction }>
                        { lang === "es" ? "Confirmar" : "Confirm" }
                    </Button>
                </section>
            )
        } else if (onlyWithProvider === false) {
            return (
                <Form action={ deleteAction } className="m-3 flex flex-col items-center">
                    <Input 
                    isRequired
                    name="password"
                    size="lg"
                    type={ isVisible ? "text" : "password" }
                    autoComplete="current-password"
                    errorMessage={ lang === "es" ? "Ingresa tu contraseña para confirmar" : "Enter your password to confirm" }
                    label={ lang === "es" ? "Confirma esta acción ya que ésta será permanente e irreversible:" : "Confirm this action as this will be irreversible:" }
                    labelPlacement="outside" 
                    value={ password }
                    onValueChange={ setPassword }
                    placeholder={ lang === "es" ? "Ingresa tu contraseña" : "Enter your password" }
                    endContent={
                        <button 
                        aria-label="toggle password visibility"
                        className="focus:outline-none cursor-pointer"
                        type="button"
                        onClick={ toggleVisibility }>
                            { isVisible ? (
                                <EyeOff />
                            ) : (
                                <Eye />
                            )}
                        </button>   
                    }/>
                    <p className="text-danger text-center">{ deleteState && deleteState.message }</p>
                    <Button 
                    isLoading={ pending } 
                    isDisabled={ pending } 
                    className="action-button" 
                    type="submit">
                        { lang === "es" ? "Confirmar" : "Confirm" }
                    </Button>
                </Form>
            )
        }
    }
}