"use client"
import { DynamicTable } from "@/app/lib/utils-client";
import { Button } from "@heroui/react";
import { SetStateAction, useCallback } from "react";
import { ChevronDoubleDown, ChevronDoubleUp } from "../icons";
import { useParams } from "next/navigation";

export default function RowsActions ({ setVersion, tableInstance }: {
    setVersion: React.Dispatch<SetStateAction<number>>,
    tableInstance: DynamicTable
}) {
    const params = useParams<{ lang: "en" | "es" }>();
    const updateTable = useCallback((mutatorFn: () => void) => {
        mutatorFn();
        setVersion(v => v + 0.5);
    }, [tableInstance]);
    
    return (
        <div className="row-start-2 row-span-1 flex flex-col gap-2 items-end w-full pr-5 mt-5">
            <Button
            isIconOnly
            className="p-2"
            size="lg"
            variant="bordered"
            aria-label={params.lang === "es" ? "Eliminar fila" : "Delete row"} 
            onPress={() => updateTable(() => {
                tableInstance.removeRow();
                tableInstance.deleteRowTab();
            })}>
                <ChevronDoubleUp width={32} height={32} />
            </Button>
            <Button
            isIconOnly
            className="p-2"
            size="lg"
            aria-label={params.lang === "es" ? "Añadir fila" : "Add row"} 
            onPress={() => updateTable(() => {
                tableInstance.addRow();
                tableInstance.createRowTab("");
            })}>
                <ChevronDoubleDown width={32} height={32} />
            </Button>
        </div>
    )
}