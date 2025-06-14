"use client"
import { DynamicTable } from "@/app/lib/utils-client";
import { Button } from "@heroui/react";
import { SetStateAction, useCallback } from "react";
import { ChevronDoubleLeft, ChevronDoubleRight } from "../icons";
import { useParams } from "next/navigation";
import SaveButton from "./save-button";

export default function ColumnsActions ({ setVersion, tableInstance }: {
    setVersion: React.Dispatch<SetStateAction<number>>,
    tableInstance: DynamicTable
}) {
    const params = useParams<{ lang: "en" | "es" }>();
    const updateTable = useCallback((mutatorFn: () => void) => {
        mutatorFn();
        setVersion(v => v + 0.5);
    }, [tableInstance]);
    return (
        <div className="col-start-2 col-span-1 flex flex-row items-center justify-between w-[75vw]">
            <div className="flex flex-row gap-2">
                <Button 
                isIconOnly 
                className="p-2" 
                size="lg"
                variant="bordered"
                aria-label={params.lang === "es" ? "Eliminar columna" : "Delete column"}
                onPress={() => updateTable(() => {
                    tableInstance.removeColumn(tableInstance.size - 1);
                    tableInstance.deleteColTab();
                })}>
                    <ChevronDoubleLeft width={32} height={32} />
                </Button>
                <Button 
                isIconOnly 
                className="p-2"
                size="lg"
                aria-label={params.lang === "es" ? "Añadir columna" : "Add column"} 
                onPress={() => updateTable(() => {
                    tableInstance.addColumn();
                    tableInstance.createColTab("");
                })}>
                    <ChevronDoubleRight width={32} height={32}/>
                </Button>
            </div>
            <SaveButton />
        </div>
    )
}