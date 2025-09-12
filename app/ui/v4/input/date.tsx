"use client"
import { motion } from "motion/react";
import { SharedSelection } from "@heroui/react";
import HeaderModal from "../modal/header-modal";
import { Header } from "../../icons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
        console.log(initialValue)
        if (initialValue && typeof initialValue === "string") {
            const isDate = z.iso.date().safeParse(initialValue);
            if (isDate.success) {
                const date = new Date(initialValue);
                const calendar = new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
                return parseDate(calendar.toString());
            } else {
                return null;
            }
        }
        return null;
    });
    useEffect(() => {
        console.log(value?.toString())
    }, [value])
    return (
        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
            <DatePicker
                variant="bordered"
                classNames={{
                inputWrapper: "w-[63vw] sm:w-64 h-[48px]",
                }}
                value={value}
                onChange={e => {
                    if (e) {
                        handleDuplicates(e.toString());
                    }
                    setValue(e);                    
                    table.options.meta?.updateData(row.index, column.id, value?.toString());
                }}
                startContent={
                    row.index === 0 || column.id === "A" 
                    ? row.index === 0 && column.id === "B" 
                        ? <HeaderModal interval={interval} setInterval={setInterval} headerType={headerType} setHeaderType={setHeaderType} />
                        : <Header color={ isDuplicate ? "oklch(57.7% 0.245 27.325)" : "#3f3f46"} /> 
                    : null
                }
                errorMessage={
                    isDuplicate 
                    ? lang === "en" 
                        ? "Duplicate value" 
                        : "Valor duplicado"
                    : undefined
                }
                isInvalid={isDuplicate}
            />
        </motion.div>
    )
}