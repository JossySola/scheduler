"use client"
import { Alert, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { useParams } from "next/navigation";
import { WarningFill } from "../icons";

export default function Conflicts ({ conflicts }: {
    conflicts: Array<string | undefined>,
}) {
    const { lang } = useParams<{ lang: "en" | "es" }>();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
        <Button isIconOnly aria-label={lang === "es" ? "Conflictos" : "Conflicts"} onPress={onOpen} variant="light" className="text-yellow-300">
            <WarningFill width={32} height={32}/>
        </Button>
        <Modal isOpen={isOpen} placement="center" backdrop="blur" onOpenChange={onOpenChange} >
            <ModalContent>
                {
                    (onClose) => (
                        <>
                        <ModalHeader>{ lang === "es" ? "Conflictos" : "Conflicts" }</ModalHeader>
                        <ModalBody className="flex flex-col gap-3">
                            <i className="text-md">{ lang === "es" ? "Recuerda que también puedes editar las celdas manualmente sin necesidad de Generar la tabla nuevamente" : "You can always edit the cells manually without generating the table again" }</i>
                            {
                                conflicts 
                                ? conflicts.map(conflict => conflict !== undefined ? <Alert className="text-lg" color="warning" description={ conflict } radius="full"/> : null)
                                : <p className="text-danger">{ lang === "es" ? "No hay conflictos" : "No conflicts" }</p>
                            }
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="flat" onPress={onClose}>
                                { lang === "es" ? "Cerrar" : "Close" }
                            </Button>
                        </ModalFooter>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
        </>
    )
    
}