"use client"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, NumberInput, Select, SelectItem, useDisclosure } from "@heroui/react"
import { SettingsSliders } from "../../icons";
import { useParams } from "next/navigation";
import { ChangeEvent, ChangeEventHandler } from "react";

export default function HeaderModal({interval, setInterval, headerType, setHeaderType}: {
    interval: number,
    setInterval: (interval: number) => void,
    headerType: "text" | "time" | "date",
    setHeaderType: (type: "text" | "time" | "date") => void,
}) {
    const { lang } = useParams<{ lang: "es" | "en" }>();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const handleSelectionChange = (value: string) => {
        setHeaderType(value as "text" | "time" | "date");
    }
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
                                selectedKeys={[headerType]}
                                onChange={(e) => handleSelectionChange(e.target.value)}>
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
                                value={interval} 
                                onValueChange={setInterval} 
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