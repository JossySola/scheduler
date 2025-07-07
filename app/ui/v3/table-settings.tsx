"use client"
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Tab, Tabs, useDisclosure } from "@heroui/react";
import { useParams } from "next/navigation";
import { Box, SettingsGearFill } from "../icons";
import RowSpecs from "./row-specs";
import ColSpecs from "./col-specs";
import { useContext, useEffect } from "react";
import { TableContext } from "@/app/[lang]/table/context";
import ValuesList from "./list";
import { RowType } from "@/app/lib/utils-client";
import HeaderSpecs from "./header-specs";
import * as zod from "zod/v4";
import { DateFormatter, getLocalTimeZone, parseDate, parseTime } from "@internationalized/date";
import { useSettingsUpdate } from "@/app/hooks/custom";
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { tableGenerationSchema } from "@/app/api/generate/schema";

type ObjectType = {
    value: string,
    conflict?: boolean,
    specs?: {
        disabled: boolean,
        disabledCols: Array<string>,
        rowTimes: number,
        preferValues: Array<string>,
        colTimes: number,
        valueTimes: Array<[string, number]>,
    },
};
export default function TableSettings () {
    const { lang } = useParams<{ lang: "en" | "es" }>();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { table, setConflicts, setIsGenerating } = useContext(TableContext);
    const settingsUpdate = useSettingsUpdate();
    const { object, submit, isLoading } = useObject({
        api: '/api/generate',
        schema: tableGenerationSchema,
    });
    const handleGeneration = () => {
        const rows = table.rows.map(col => {
            return Array.from(col.entries()).map(([key, value]): [string, ObjectType] => {
                if (value.specs) {
                    return [
                        key,
                        {
                            ...value,
                            specs: {
                                ...value.specs,
                                valueTimes: Array.from(value.specs.valueTimes),
                            }
                        }
                    ];
                }
                return [key, value as ObjectType];
            })
        })
        const values = Array.from(table.values);
        submit({
            rows,
            values,
            lang,
        });
    }
    useEffect(() => {
        console.log(object)
        if (object && object.conflicts && setConflicts) setConflicts(object.conflicts as string[]);
        if (object && object.rows !== undefined) {
            const cells = object.rows;
            if (cells.length > 0) {
                cells.forEach(cell => {
                    if (cell !== undefined) {
                        if (cell[0] && cell[1] && cell[2]) {
                            if (cell[0] !== undefined && cell[1] !== undefined && cell[2] !== undefined) {
                                const label = cell[0];
                                const value = cell[1];
                                const conflict = cell[2];
                                table.rows.forEach(row => {
                                    const cellExists = row.has(label);
                                    if (cellExists) {
                                        const previousData = row.get(label);
                                        row.set(label, {
                                            value,
                                            conflict,
                                            ...previousData
                                        })
                                    }
                                })
                            }
                        }
                    }
                })
            }
        }
    }, [object])
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
                            classNames={{
                                tab: table.rows[0].size > 6 ? "" : "overflow-hidden",
                                tabWrapper: table.rows[0].size > 6 ? "overflow-x-scroll" : "",
                                tabContent: table.rows[0].size > 6 ? "" : "w-full truncate",
                            }}
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
                                                return `${time} hrs`;
                                            }
                                            if (col.value.length > 0) {
                                                return col.value;
                                            }
                                            return lang === "es" ? "Sin nombre" : "No name";
                                        }
                                        if (colIndex !== 0) {
                                            return (
                                                <Tab key={colIndex} title={title()}>
                                                    <ColSpecs colIndex={colIndex} title={title()} />
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
                                panel: "w-2/3",
                                tabWrapper: "",
                                base: "w-1/3",
                                tabList: "w-full",
                                tab: "overflow-hidden",
                                tabContent: "w-full truncate",
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
                                                    <RowSpecs rowIndex={rowIndex} title={title} />
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
                            <Button 
                            size="lg" 
                            isDisabled={ isLoading }
                            isLoading={ isLoading }
                            className="bg-gradient-to-tr from-violet-600 to-blue-500 text-white shadow-lg" 
                            onPress={ handleGeneration } 
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