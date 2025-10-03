"use client"
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, useDisclosure } from "@heroui/react";
import { useParams } from "next/navigation"
import { Box, SettingsGearFill } from "../../icons";
import { Dispatch, Key, SetStateAction, useMemo } from "react";
import ValuesList from "../table/list";
import { ColumnDef, Table } from "@tanstack/react-table";
import { ColSpecs, RowSpecs, VTData } from "@/app/hooks/custom";
import ColTabs from "../tabs/col-tabs";
import RowTabs from "../tabs/row-tabs";
import { useSession } from "next-auth/react";
import { tableGenerationSchema } from "@/app/api/generate/schema";

export default function Settings({ table, values, colSpecs, rowSpecs, setValues, setColumns, setColSpecs, setRowSpecs, getTableStates, handleSubmit, previousStorage }: {
    table: Table<VTData>,
    values: Set<string>,
    colSpecs: ColSpecs,
    rowSpecs: RowSpecs,
    setValues: Dispatch<SetStateAction<Set<string>>>,
    setColumns: Dispatch<SetStateAction<ColumnDef<VTData>[]>>,
    setColSpecs: Dispatch<SetStateAction<ColSpecs>>,
    setRowSpecs: Dispatch<SetStateAction<RowSpecs>>,
    previousStorage: string | null,
    getTableStates: () => {
        values: string[];
        headerType: Key[];
        cols: string[];
        title: string;
        data: VTData[];
        interval: number;
        colSpecs: ColSpecs;
        rowSpecs: RowSpecs;
    },
    handleSubmit: (input: any) => void,
}) {
    const { lang } = useParams<{ lang: "es" | "en" }>();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { data: session } = useSession();
    const rows = useMemo(() => table.getRowModel().rows.map(row =>  row.original["A"]), [tableGenerationSchema]);

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
            <Drawer isOpen={isOpen} size="md" backdrop="blur" onOpenChange={onOpenChange}>
                <DrawerContent>
                    {onClose => (
                        <>
                            <DrawerHeader>

                            </DrawerHeader>
                            <DrawerBody>
                                <h3>{ lang === "es" ? "Criteria de Columnas" : "Columns Specifications" }</h3>
                                <ColTabs 
                                table={table} 
                                values={values}
                                colSpecs={colSpecs}
                                setColSpecs={setColSpecs} />

                                <h3>{ lang === "es" ? "Criteria de Filas" : "Rows Specifications" }</h3>
                                <RowTabs
                                table={table}
                                rowSpecs={rowSpecs}
                                setRowSpecs={setRowSpecs}
                                values={values} />

                                <h3>{ lang === "es" ? "Valores de celdas" : "Cell values" }</h3>
                                <ValuesList values={values} setValues={setValues} setColumns={setColumns} />
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
                                    const {
                                        values,
                                        cols,
                                        colSpecs,
                                        rowSpecs,
                                    } = getTableStates();
                                    handleSubmit({
                                        lang,
                                        user_id: session?.user?.id,
                                        values,
                                        rows,
                                        cols,
                                        colSpecs,
                                        rowSpecs,
                                        previousStorage,
                                    });
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