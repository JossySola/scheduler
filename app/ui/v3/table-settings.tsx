"use client"
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Tab, Tabs, useDisclosure } from "@heroui/react";
import { useParams } from "next/navigation";
import { Box, SettingsGearFill } from "../icons";
import RowSpecs from "./row-specs";
import ColSpecs from "./col-specs";
import { useContext } from "react";
import { TableContext } from "@/app/[lang]/table/context";
import ValuesList from "./list";
import { RowType } from "@/app/lib/utils-client";
import HeaderSpecs from "./header-specs";
import * as zod from "zod/v4";
import { DateFormatter, getLocalTimeZone, parseDate, parseTime } from "@internationalized/date";
import { useSettingsUpdate } from "@/app/hooks/custom";

export default function TableSettings () {
    const { lang } = useParams<{ lang: "en" | "es" }>();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { table } = useContext(TableContext);
    const settingsUpdate = useSettingsUpdate();

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
                            <h3>{ lang === "es" ? "Ajustes de columna" : "Columns' Specifications" }</h3>
                            <Tabs
                            fullWidth={ true }
                            aria-label={ lang === "es" ? "Ajustes de columna" : "Columns' Specifications" }>
                                {
                                    table.size > 0 ? Array.from(table.rows[0].values()).map((col: RowType, colIndex: number) => {
                                        const isDate = zod.iso.date().safeParse(col.value).success;
                                        const isTime = zod.iso.time().safeParse(col.value).success;
                                        const title = () => {
                                            if (isDate) {
                                                const dateFormat = new DateFormatter(lang, {
                                                    weekday: "long",
                                                    day: "numeric",
                                                    month: "short"
                                                }).format(parseDate(col.value).toDate(getLocalTimeZone()));
                                                return dateFormat;
                                            }
                                            if (isTime) {
                                                const time = parseTime(col.value);
                                                return `${time.hour}:${time.minute} hrs`;
                                            }
                                            if (col.value.length > 0) {
                                                return col.value;
                                            }
                                            return lang === "es" ? "Sin nombre" : "No name";
                                        }
                                        if (colIndex !== 0) {
                                            return (
                                                <Tab key={colIndex} title={title()}>
                                                    <ColSpecs colIndex={colIndex} />
                                                </Tab>
                                            )
                                        }
                                    }) : null
                                }
                            </Tabs>
                            <h3>{ lang === "es" ? "Ajuste de filas" : "Rows' Specifications" }</h3>
                            <Tabs isVertical
                            fullWidth={ true }
                            classNames={{
                                panel: "flex flex-col gap-10 w-xl",
                                tabWrapper: "",
                            }}
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
                            <h3>{ lang === "es" ? "Valores" : "Values" }</h3>
                            <ValuesList settingsUpdate={settingsUpdate} />
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