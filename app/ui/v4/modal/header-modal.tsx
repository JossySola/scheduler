"use client"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, NumberInput, Select, SelectItem, SharedSelection, useDisclosure } from "@heroui/react"
import { SettingsSliders } from "../../icons";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function HeaderModal({interval, setInterval, headerType, setHeaderType}: {
    interval: number,
    setInterval: Dispatch<SetStateAction<number>>,
    headerType: SharedSelection,
    setHeaderType: Dispatch<SetStateAction<SharedSelection>>,
}) {
    const { lang } = useParams<{ lang: "es" | "en" }>();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [selection, setSelection] = useState<SharedSelection>(new Set(headerType));
    const [number, setNumber] = useState<number>(interval);
    useEffect(() => {
        setHeaderType(selection);
    }, [selection]);
    useEffect(() => {
        setInterval(number);
    }, [number]);
    return (
        <>
            <Button isIconOnly onPress={onOpen} size="sm" color="primary"><SettingsSliders /></Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
                <ModalContent>
                    { onClose => (
                        <>
                            <ModalHeader>
                                {lang === "es" ? "Ajustes de encabezado" : "Header settings"}
                            </ModalHeader>
                            <ModalBody>
                                <Select
                                label={ lang === "es" ? "Tipo de encabezados" : "Headers' type" }
                                selectedKeys={selection}
                                onSelectionChange={setSelection}>
                                    <SelectItem key="text">
                                        {lang === "es" ? "Texto" : "Text"}
                                    </SelectItem>
                                    <SelectItem key="time">
                                        {lang === "es" ? "Tiempo" : "Time"}
                                    </SelectItem>
                                    <SelectItem key="date">
                                        {lang === "es" ? "Fecha" : "Date"}
                                    </SelectItem>                                    
                                </Select>

                                <NumberInput
                                label={ lang === "es" ? "Intervalo de tiempo" : "Time interval" } 
                                value={number} 
                                minValue={1}
                                onValueChange={setNumber} 
                                size="lg" />
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="solid" color="default" onPress={onClose}>{lang === "es" ? "Cerrar" : "Close"}</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}