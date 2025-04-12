"use client"
import { useParams } from "next/navigation"
import { ActionButton, SecondaryButton } from "../atoms/atom-button"
import { Form, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { Trash } from "geist-icons";
import { DeleteTableAction } from "@/app/[lang]/dashboard/@list/actions";
import { useActionState } from "react";

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
        <ActionButton onPress={onOpen} color="danger" endContent={<Trash width="16px" />}>{ lang === "es" ? "Borrar" : "Delete"}</ActionButton>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {onClose => (
                    <>
                    <ModalHeader className="flex flex-col gap-1 text-center">
                        <h3>{ lang === "es" ? "Eliminar tabla" : "Delete schedule" }</h3>
                    </ModalHeader>
                    <ModalBody className="flex flex-col justify-center items-center">
                        <h3 className="m-0">{ table_name }</h3>
                        <Form action={ action } className="m-5 flex flex-col items-center">
                            <p>{ lang === "es" ? "Confirma esta acción, ya que será irreversible" : "Confirm this action as this will be irreversible" }</p>
                            <input value={ table_id } name="item_id" readOnly hidden />
                            <span className="text-danger">{ state.message }</span>
                            <ActionButton type="submit" color="danger" loading={ pending } disabled={ pending }>{ lang === "es" ? "Eliminar" : "Delete" }</ActionButton>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <SecondaryButton onPress={ onClose }>{ lang === "es" ? "Cancelar" : "Cancel" }</SecondaryButton>
                    </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
        </>
    )
}