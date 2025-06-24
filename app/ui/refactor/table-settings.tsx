"use client"
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Tab, Tabs, useDisclosure } from "@heroui/react";
import { useParams } from "next/navigation";
import { Box, SettingsGearFill } from "../icons";
import RowSpecs from "./row-specs";
import ColSpecs from "./col-specs";
import { useContext, useState } from "react";
import { TableContext } from "@/app/[lang]/table/context";
import ValuesList from "./list";
import { RowType } from "@/app/lib/utils-client";
import HeaderSpecs from "./header-specs";

export default function TableSettings () {
    const { lang } = useParams<{ lang: "en" | "es" }>();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { table } = useContext(TableContext);
    const [_, setSettingsVersion] = useState<number>(0);

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
                            <HeaderSpecs />
                            <h3>{ lang === "es" ? "Ajuste de filas" : "Rows' Specifications" }</h3>
                            <Tabs 
                            fullWidth={ true }
                            aria-label={ lang === "es" ? "Ajuste de filas" : "Rows' Specifications" }>
                                {
                                    table.size > 0 ? table.rows.map((map: Map<string, RowType>, rowIndex: number) => {
                                        const rawTitle = map.get(`A${rowIndex}`)?.value;
                                        const title = rawTitle && rawTitle.trim() !== "" 
                                            ? rawTitle 
                                            : lang === "es" ? "Sin nombre" : "No name";
                                        if (rowIndex !== 0) {
                                            return (
                                                <Tab key={rowIndex} title={title}>
                                                    <RowSpecs rowIndex={rowIndex} />
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
                                    table.size > 0 ? Array.from(table.rows[0].values()).map((col: RowType, colIndex: number) => {
                                        if (colIndex !== 0) {
                                            return (
                                                <Tab key={colIndex} title={col.value && typeof col.value === 'string' ? col.value : lang === "es" ? "Sin nombre" : "No name"}>
                                                    <ColSpecs colIndex={colIndex} />
                                                </Tab>
                                            )
                                        }
                                    }) : null
                                }
                            </Tabs>
                            <h3>{ lang === "es" ? "Valores" : "Values" }</h3>
                            <ValuesList setSettingsVersion={setSettingsVersion} />
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