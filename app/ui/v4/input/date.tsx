"use client"
import { motion } from "motion/react";
import { SharedSelection } from "@heroui/react";
import { Dispatch, SetStateAction, useState } from "react";
import { useParams } from "next/navigation";
import { CalendarDate, parseDate } from "@internationalized/date";
import { DatePicker } from "@heroui/date-picker";
import * as z from "zod/v4";
import { Table } from "@tanstack/react-table";
import { VTData } from "@/app/hooks/custom";

export default function DateInput({ initialValue, handleDuplicates, isDuplicate, table, row, column, interval, headerType, setInterval, setHeaderType }: {
    initialValue: unknown,
    handleDuplicates: (val: string) => void,
    isDuplicate: boolean,
    table: Table<VTData>,
    row: { index: number },
    column: { id: string },
    interval: number,
    headerType: SharedSelection,
    setInterval: Dispatch<SetStateAction<number>>,
    setHeaderType: Dispatch<SetStateAction<SharedSelection>>,
}) {
    const { lang } = useParams<{ lang: "es" | "en" }>();
    const [value, setValue] = useState<CalendarDate| null>(() => {
        if (initialValue && typeof initialValue === "string") {
            const isDate = z.iso.date().safeParse(initialValue);
            if (isDate.success) {
                return parseDate(initialValue.toString());
            } else {
                return null;
            }
        }
        return null;
    });
    const onBlur = () => {
        if (value) {
            const calendar = parseDate(value.toString());
            if (row.index === 0 && column.id === "B") {
                let nextDate = calendar;
                table.getRowModel().rows[0]?.getAllCells().forEach((cell, index) => {
                    if (index > 1) {
                        table.options.meta?.updateData(0, cell.column.id, nextDate.toString() ?? "");
                        nextDate = nextDate.add({ days: interval });                        
                    }
                })
            table.options.meta?.triggerRefresh();                
                return;
            }
            table.options.meta?.updateData(row.index, column.id, calendar.toString() ?? "");
        }
    }; 
    return (
        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
            <DatePicker
                aria-label={ lang === "en" ? `Select date for cell row ${row.index} and column ${column.id}` : `Selecciona fecha para la celda fila ${row.index} y columna ${column.id}` }
                size="lg"
                variant="bordered"
                classNames={{
                inputWrapper: "w-[63vw] sm:w-64 h-[48px]",
                }}
                onBlur={onBlur}
                value={value}
                onChange={e => {
                    setValue(e);                    
                    if (e) {
                        handleDuplicates(e.toString());
                    }
                }}
                errorMessage={
                    isDuplicate 
                    ? lang === "en" 
                        ? "Duplicate header" 
                        : "Encabezado duplicado"
                    : undefined
                }
                isInvalid={isDuplicate}
            />
        </motion.div>
    )
}