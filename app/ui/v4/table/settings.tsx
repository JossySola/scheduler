"use client"
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, useDisclosure } from "@heroui/react";
import { useParams } from "next/navigation"
import { Box, SettingsGearFill } from "../../icons";

export default function Settings() {
    const { lang } = useParams<{ lang: "es" | "en" }>();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    return (
        <>
            <div className="col-start-1 row-start-1 w-full flex flex-row justify-end items-center pr-5">
                <Button 
                isIconOnly 
                className="p-3"
                size="lg"
                color="primary"
                aria-label={lang === "es" ? "Ajustes de tabla" : "Table settings"}
                onPress={onOpen}>
                    <SettingsGearFill width={32} height={32} />
                </Button>
            </div>
            <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
                <DrawerContent>
                    {onClose => (
                        <>
                            <DrawerHeader>

                            </DrawerHeader>
                            <DrawerBody>

                            </DrawerBody>
                            <DrawerFooter>
                                <Button size="lg" color="default" variant="flat" onPress={onClose}>
                                    {
                                        lang === "es" ? "Cerrar" : "Close"
                                    }
                                </Button>
                                <Button 
                                isDisabled={ false }
                                isLoading={ false }
                                size="lg"
                                className="bg-gradient-to-tr from-violet-600 to-blue-500 text-white shadow-lg" 
                                onPress={ () => {
                                    onClose();
                                } } 
                                endContent={<Box />}>
                                    {
                                        lang === "es" ? "Generar" : "Generate"
                                    }
                                </Button>                        
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    )
}