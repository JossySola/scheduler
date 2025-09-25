"use client"
import { motion } from "motion/react";
import { Select as SelectHeroUi, SelectItem } from "@heroui/react";
import { useState } from "react";
import { Table } from "@tanstack/react-table";
import { VTData } from "@/app/hooks/custom";

export default function Select({ value, table, row, column, values }: {
    value: string,
    table: Table<VTData>,
    row: { index: number },
    column: { id: string },
    values: Set<string>,
}) {
    const [selection, setSelection] = useState<string>(value);
    const handleSelectionChange = (newSelection: string) => {
        setSelection(newSelection);
        table.options.meta?.updateData(row.index, column.id, newSelection);
    }    
    const isVirtual = values.size > 10;
    return (
        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
            <SelectHeroUi
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
            </SelectHeroUi>
        </motion.div>        
    )
}