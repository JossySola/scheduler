"use client"
import { Button } from "@heroui/react";
import { useCallback, useContext } from "react";
import { ChevronDoubleDown, ChevronDoubleUp } from "../icons";
import { useParams } from "next/navigation";
import { TableContext } from "@/app/[lang]/table/context";

export default function RowsActions () {
    const params = useParams<{ lang: "en" | "es" }>();
    const { table, setPanelRender } = useContext(TableContext);
    const updateTable = useCallback((mutatorFn: () => void) => {
        mutatorFn();
        setPanelRender && setPanelRender(v => v+1);
    }, [table]);
    
    return (
        <div className="row-start-2 row-span-1 flex flex-col gap-2 items-end w-full pr-5 mt-5">
            <Button
            isIconOnly
            className="p-2"
            size="lg"
            variant="bordered"
            aria-label={params.lang === "es" ? "Eliminar fila" : "Delete row"} 
            onPress={() => updateTable(() => {
                table.deleteRow();
            })}>
                <ChevronDoubleUp width={32} height={32} />
            </Button>
            <Button
            isIconOnly
            className="p-2"
            size="lg"
            aria-label={params.lang === "es" ? "Añadir fila" : "Add row"} 
            onPress={() => updateTable(() => {
                table.insertRow();
            })}>
                <ChevronDoubleDown width={32} height={32} />
            </Button>
        </div>
    )
}