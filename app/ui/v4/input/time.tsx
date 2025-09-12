"use client"
import { motion } from "motion/react";
import * as zod from "zod/v4";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { parseTime, Time } from "@internationalized/date";
import { SharedSelection } from "@heroui/react";
import { TimeInput as TimeHeroUi } from "@heroui/react";
import { ClockDashed } from "../../icons";
import HeaderModal from "../modal/header-modal";
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
        table.options.meta?.updateData(row.index, column.id, value?.toString() ?? "");
    };     
    return (
        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
            <TimeHeroUi
            size="lg"
            variant="bordered"
            classNames={{
                inputWrapper: "w-[63vw] sm:w-64 h-[48px]",
            }}
            startContent={
                row.index === 0 || column.id === "A" 
                ? row.index === 0 && column.id === "A"
                    ? <HeaderModal interval={interval} setInterval={setInterval} headerType={headerType} setHeaderType={setHeaderType} />
                    : <ClockDashed /> 
                : null
            }
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