"use client"
import { motion } from "motion/react";
import { VTData } from "@/app/hooks/custom"
import { Input, Select, SelectItem } from "@heroui/react";
import { Getter, Table } from "@tanstack/react-table"
import { useState } from "react";
import { Header } from "../../icons";
import { useDebouncedCallback } from "use-debounce";
import { useParams } from "next/navigation";

export default function CellRenderer ({getValue, row, column, table, values}: {
    getValue: Getter<unknown>,
    row: { index: number },
    column: { id: string },
    table: Table<VTData>,
    values: Set<string>
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
            const isDuplicate = table.getRowModel().rows.some((r, idx) => r.getValue(column.id) === val && idx !== row.index);
            setIsDuplicate(isDuplicate);
            return;
        }
        if (row.index === 0 && val.length) {
            const isDuplicate = table.getRowModel().rows.some((r, idx) => r.getValue(column.id) === val && idx !== row.index);
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
            classNames={{ mainWrapper: "w-[55vw] sm:w-64" }}
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
                    mainWrapper: "w-[55vw] sm:w-64",
                    inputWrapper: "h-[48px]",
                    }}
                    value={(value as string) ?? ""}
                    onChange={e => handleDuplicates(e.target.value)}
                    onValueChange={setValue}
                    startContent={row.index === 0 || column.id === "A" ? <Header color={ isDuplicate ? "oklch(57.7% 0.245 27.325)" : "#3f3f46"} /> : null}
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