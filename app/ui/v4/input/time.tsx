"use client"
import { motion } from "motion/react";
import * as zod from "zod/v4";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { parseTime, Time } from "@internationalized/date";
import { SharedSelection } from "@heroui/react";
import { TimeInput as TimeHeroUi } from "@heroui/react";
import { ClockDashed } from "../../icons";
import { Table } from "@tanstack/react-table";
import { VTData } from "@/app/hooks/custom";

export default function TimeInput({ initialValue, handleDuplicates, isDuplicate, table, row, column, interval, headerType, setInterval, setHeaderType }: {
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
    const { lang } = useParams<{ lang: "en" | "es" }>();
    const [value, setValue] = useState<Time | null>(() => {
        if (initialValue) {
            const isTime = zod.iso.time().safeParse(initialValue);
            if (isTime.success) {
                return parseTime(isTime.data);
            }
            return null;
        }
        return null;
    });
    const onBlur = () => {
        if (value) {
            if (row.index === 0 && column.id === "B") {
                let nextDate = value;
                table.getRowModel().rows[0]?.getAllCells().forEach((cell, index) => {
                    if (index > 1) {
                        table.options.meta?.updateData(0, cell.column.id, nextDate.toString() ?? "");
                        nextDate = nextDate.add({ minutes: interval });
                        table.options.meta?.triggerRefresh();
                    }
                })
                return;
            }
            table.options.meta?.updateData(row.index, column.id, value.toString() ?? "");
            return;
        }
    };     
    return (
        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
            <TimeHeroUi
            size="lg"
            variant="bordered"
            classNames={{
                inputWrapper: "w-[63vw] sm:w-64 h-[48px]",
            }}
            startContent={ <ClockDashed /> }
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
                    ? "Duplicate value" 
                    : "Valor duplicado"
                : undefined
            }
            isInvalid={isDuplicate} />
        </motion.div>
    )
}