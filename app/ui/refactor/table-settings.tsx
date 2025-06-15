"use client"
import { Button, Card, CardBody, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Tab, Tabs, useDisclosure } from "@heroui/react";
import { useParams } from "next/navigation";
import { Box, SettingsGearFill } from "../icons";
import RowSpecs from "./row-specs";
import ColSpecs from "./col-specs";
import { useContext } from "react";
import { TableContext } from "@/app/[lang]/table/context";
import ValuesList from "./list";

export default function TableSettings () {
    const { lang } = useParams<{ lang: "en" | "es" }>();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { table } = useContext(TableContext);
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
                            <h2>{ lang === "es" ? "Ajustes de tabla" : "Table settings" }</h2>
                        </DrawerHeader>
                        <DrawerBody>
                            <h3>{ lang === "es" ? "Ajuste de filas" : "Rows' Specifications" }</h3>
                            <Tabs 
                            fullWidth={ true }
                            aria-label={ lang === "es" ? "Ajuste de filas" : "Rows' Specifications" }>
                                {
                                    table.row_specs.length ? table.row_specs.map((tab: Map<any, any>, tabIndex: number) => {
                                        const title = tab.get("name");
                                        if (tabIndex !== 0) {
                                            return ( 
                                                <Tab key={tabIndex} title={title && typeof title === 'string' ? title : lang === "es" ? "Sin nombre" : "No name"}>
                                                    <RowSpecs tab={tab} />
                                                </Tab> 
                                            )
                                        }
                                    }) : null
                                }
                            </Tabs>
                            <h3>{ lang === "es" ? "Ajustes de columna" : "Columns' Specifications" }</h3>
                            <Tabs
                            fullWidth={ true }
                            aria-label={ lang === "es" ? "Ajustes de columna" : "Columns' Specifications" }>
                                {
                                    table.col_specs.length ? table.col_specs.map((tab: Map<any, any>, tabIndex: number) => {
                                        const title = tab.get("name");
                                        if (tabIndex !== 0) {
                                            return (
                                                <Tab key={tabIndex} title={title && typeof title === 'string' ? title : lang === "es" ? "Sin nombre" : "No name"}>
                                                    <ColSpecs tab={tab} />
                                                </Tab>
                                            )
                                        }
                                    }) : null
                                }
                            </Tabs>
                            <h3>{ lang === "es" ? "Valores" : "Values" }</h3>
                            <ValuesList />
                        </DrawerBody>
                        <DrawerFooter>
                            <Button size="lg" color="default" variant="flat" onPress={onClose}>
                                {
                                    lang === "es" ? "Cerrar" : "Close"
                                }
                            </Button>
                            <Button size="lg" className="bg-gradient-to-tr from-violet-600 to-blue-500 text-white shadow-lg" onPress={onClose} endContent={<Box />}>
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