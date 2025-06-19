"use client"
import { Button } from "@heroui/react";
import { useCallback, useContext } from "react";
import { ChevronDoubleLeft, ChevronDoubleRight } from "../icons";
import { useParams } from "next/navigation";
import SaveButton from "./save-button";
import { TableContext } from "@/app/[lang]/table/context";

export default function ColumnsActions () {
    const params = useParams<{ lang: "en" | "es" }>();
    const { table, setPanelRender } = useContext(TableContext);
    const updateTable = useCallback((mutatorFn: () => void) => {
        mutatorFn();
        setPanelRender && setPanelRender(v => v+1);
    }, [table]);
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
                    table.deleteColumn();
                })}>
                    <ChevronDoubleLeft width={32} height={32} />
                </Button>
                <Button 
                isIconOnly 
                className="p-2"
                size="lg"
                aria-label={params.lang === "es" ? "Añadir columna" : "Add column"} 
                onPress={() => updateTable(() => {
                    table.insertColumn();
                })}>
                    <ChevronDoubleRight width={32} height={32}/>
                </Button>
            </div>
            <SaveButton />
        </div>
    )
}