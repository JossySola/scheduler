"use client"
import { Button } from "@heroui/react";
import { useCallback, useContext } from "react";
import { ChevronDoubleLeft, ChevronDoubleRight } from "../icons";
import { useParams } from "next/navigation";
import SaveButton from "./save-button";
import { TableContext } from "@/app/[lang]/table/context";
import { Table } from "@/app/lib/utils-client";
import { CalendarDate, parseDate, parseTime, Time } from "@internationalized/date";
import * as zod from "zod/v4";

export default function ColumnsActions () {
    const params = useParams<{ lang: "en" | "es" }>();
    const { table, panelUpdate } = useContext(TableContext);
    const updateTable = useCallback((mutatorFn: () => void) => {
        mutatorFn();
        panelUpdate();
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
                    if (table.columnType === "date" && table.rows.length > 0) {
                        const lastCol = table.rows[0].get(`${Table.indexToLabel(table.rows[0].size - 1)}0`);
                        if (lastCol) {
                            const verification = zod.iso.date().safeParse(lastCol.value);
                            if (verification.success) {
                                const date = parseDate(lastCol.value);
                                const newDate = new CalendarDate(date.year, date.month, date.day);
                                if (newDate) table.insertColumn(newDate.add({days: table.interval}).toString());
                                return;
                            }
                        }
                    }
                    if (table.columnType === "time" && table.rows.length > 0) {
                        const lastCol = table.rows[0].get(`${Table.indexToLabel(table.rows[0].size - 1)}0`);
                        if (lastCol) {
                            const verification = zod.iso.time().safeParse(lastCol.value);
                            if (verification.success) {
                                const time = parseTime(lastCol.value);
                                const newTime = new Time(time.hour, time.minute, time.second, time.millisecond);
                                if (newTime) table.insertColumn(newTime.add({minutes: table.interval}).toString());
                                return;
                            }
                        }
                    }
                    table.insertColumn();
                })}>
                    <ChevronDoubleRight width={32} height={32}/>
                </Button>
            </div>
            <SaveButton />
        </div>
    )
}