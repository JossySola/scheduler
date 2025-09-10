"use client"
import { motion } from "motion/react";
import { VTData } from "@/app/hooks/custom"
import { Input, Select, SelectItem, SharedSelection } from "@heroui/react";
import { Getter, Table } from "@tanstack/react-table"
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Header } from "../../icons";
import { useDebouncedCallback } from "use-debounce";
import { useParams } from "next/navigation";
import HeaderModal from "../modal/header-modal";

export default function CellRenderer ({getValue, row, column, table, values, interval, headerType, setInterval, setHeaderType}: {
    getValue: Getter<unknown>,
    row: { index: number },
    column: { id: string },
    table: Table<VTData>,
    values: Set<string>,
    interval: number,
    headerType: SharedSelection,
    setInterval: Dispatch<SetStateAction<number>>,
    setHeaderType: Dispatch<SetStateAction<SharedSelection>>,
}) {
    const { lang } = useParams<{ lang: "es" | "en" }>();
    const initialValue = getValue();
    const [value, setValue] = useState<string>(initialValue as string);
    const [selection, setSelection] = useState<string>(initialValue as string);
    const [isDuplicate, setIsDuplicate] = useState<boolean>(false);
    
    const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, value);
    };
    const handleSelectionChange = (newSelection: string) => {
        setSelection(newSelection);
        table.options.meta?.updateData(row.index, column.id, newSelection);
    }
    const handleDuplicates = useDebouncedCallback((val: string) => {
        setIsDuplicate(false);
        if (column.id === "A" && val.length) {
            const isDuplicate = table.getRowModel().rows.some((r, idx) => {
                const value = r.getValue(column.id);
                if (typeof value === "string") {
                    if (value.toUpperCase() === val.toUpperCase() && idx !== row.index) {
                        return true;
                    } else {
                        return false;
                    }
                }
                return value === val && idx !== row.index;
            });
            setIsDuplicate(isDuplicate);
            return;
        }
        if (row.index === 0 && val.length) {
            const cells = table.getRowModel().rows[0].getVisibleCells();
            const isDuplicate = cells.some(cell => {
                const value = cell.getValue();
                if (typeof value === "string") {
                    if (value.toUpperCase() === val.toUpperCase() && cell.column.id !== column.id) {    
                        return true;
                    } else {
                        return false;
                    }
                }
                value === val && cell.column.id !== column.id
            });
            setIsDuplicate(isDuplicate);
            return;
        }
    }, 500);

    if (values.size > 0 && row.index !== 0 && column.id !== "A") {
        const isVirtual = values.size > 10;
        return (
        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
            <Select
            isVirtualized={isVirtual}
            selectionMode="single"
            variant="bordered"
            size="lg"
            classNames={{ mainWrapper: "w-[63vw] sm:w-64" }}
            selectedKeys={selection}
            onChange={(event) => handleSelectionChange(event.target.value)}
            >
            {Array.from(values.values()).map((val, idx) => (
                <SelectItem key={idx}>{`${idx} - ${val} `}</SelectItem>
            ))}
            </Select>
        </motion.div>
        );
    } else {
        return (
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                <Input
                    variant="bordered"
                    classNames={{
                    mainWrapper: "w-[63vw] sm:w-64",
                    inputWrapper: "h-[48px]",
                    }}
                    value={(value as string) ?? ""}
                    onChange={e => handleDuplicates(e.target.value)}
                    onValueChange={setValue}
                    startContent={
                        row.index === 0 || column.id === "A" 
                        ? row.index === 0 && column.id === "B" 
                            ? <HeaderModal interval={interval} setInterval={setInterval} headerType={headerType} setHeaderType={setHeaderType} />
                            : <Header color={ isDuplicate ? "oklch(57.7% 0.245 27.325)" : "#3f3f46"} /> 
                        : null
                    }
                    onBlur={onBlur}
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
        );
    }
}