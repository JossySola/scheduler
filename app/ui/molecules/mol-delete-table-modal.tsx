"use client"
import { useParams } from "next/navigation";
import { Button, Form, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { useActionState } from "react";
import { Trash } from "../icons";
import { DeleteTableAction } from "@/app/[lang]/dashboard/actions";

export default function DeleteTableModal ({ table_id, table_name }: {
    table_id: string,
    table_name: string,
}) {
    const params = useParams();
    const lang = params.lang;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [ state, action, pending ] = useActionState(DeleteTableAction, { message: "" });

    return (
        <>
        <Button isIconOnly className="relative sm:hidden" onPress={onOpen} color="danger" aria-label={ lang === "es" ? "Eliminar horario" : "Delete schedule"}><Trash /></Button>
        <Button className="hidden sm:inline-flex" onPress={onOpen} color="danger" endContent={<Trash />} aria-label={ lang === "es" ? "Eliminar horario" : "Delete schedule"}>{ lang === "es" ? "Borrar" : "Delete"}</Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {onClose => (
                    <>
                    <ModalHeader className="flex flex-col gap-1 text-center">
                        <h3>{ lang === "es" ? `Eliminar tabla "${table_name}"?` : `Delete schedule "${table_name}"?` }</h3>
                    </ModalHeader>
                    <ModalBody className="flex flex-col justify-center items-center">
                        <Form action={ action } className="m-5 flex flex-col items-center">
                            <p className="text-center">{ lang === "es" ? "El horario se eliminará permanentemente." : "The schedule will be deleted permanently." }</p>
                            <input value={ table_id } name="item_id" readOnly hidden />
                            <span className="text-danger">{ state.message }</span>
                            <Button 
                            type="submit" 
                            color="danger"
                            isLoading={ pending } 
                            isDisabled={ pending }>
                                { lang === "es" ? "Eliminar" : "Delete" }
                            </Button>
                        </Form>
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