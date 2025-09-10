"use client"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, NumberInput, Select, SelectItem, SharedSelection, useDisclosure } from "@heroui/react"
import { SettingsSliders } from "../../icons";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useCallback } from "react";

export default function HeaderModal({interval, setInterval, headerType, setHeaderType}: {
    interval: number,
    setInterval: Dispatch<SetStateAction<number>>,
    headerType: "text" | "date" | "time",
    setHeaderType: Dispatch<SetStateAction<"text" | "date" | "time">>,
}) {
    const { lang } = useParams<{ lang: "es" | "en" }>();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const handleSelectionChange = (value: string) => {
        setHeaderType(prev => {
            console.log(prev);
            return value as "text" | "date" | "time";
        });
    }

    const SelectComponent = useCallback(() => {
        return (
            <Select
            label={ lang === "es" ? "Tipo de encabezados" : "Headers' type" }
            selectedKeys={[headerType]}
            onChange={e => handleSelectionChange(e.target.value)}>
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
        )
    }, [headerType, setHeaderType, lang]);
    const IntervalComponent = useCallback(() => {
        return (
            <NumberInput 
            label={ lang === "es" ? "Intervalo de tiempo" : "Time interval" } 
            value={interval} 
            onValueChange={setInterval} 
            size="lg" />
        )
    }, [interval, setInterval, lang]);

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
                                <SelectComponent />
                                <IntervalComponent />
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