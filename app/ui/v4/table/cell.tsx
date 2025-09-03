"use client"
import { motion } from "motion/react";
import { VTData } from "@/app/hooks/custom"
import { Input, Select, SelectItem } from "@heroui/react";
import { Getter, Table } from "@tanstack/react-table"
import { memo, useState } from "react";
import { Header } from "../../icons";

const CellRenderer = memo(function ({getValue, row, column, table, values}: {
    getValue: Getter<unknown>,
    row: { index: number },
    column: { id: string },
    table: Table<VTData>,
    values: Set<string>
}) {
    const initialValue = getValue();
    const [value, setValue] = useState<string>(initialValue as string);
    const [selection, setSelection] = useState<string>(initialValue as string);

    const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, value);
    };
    const handleSelectionChange = (newSelection: string) => {
        setSelection(newSelection);
        table.options.meta?.updateData(row.index, column.id, newSelection);
    }

    if (values && values.size > 0) {
        if (row.index !== 0 && column.id !== "A") {
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
                    <SelectItem key={idx}>{val}</SelectItem>
                ))}
                </Select>
            </motion.div>
            );
        }
        return (
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
            <Input
                variant="bordered"
                classNames={{
                mainWrapper: "w-[55vw] sm:w-64",
                inputWrapper: "h-[48px]",
                }}
                value={(value as string) ?? ""}
                onValueChange={setValue}
                startContent={row.index === 0 || column.id === "A" ? <Header color="#3f3f46" /> : null}
                onBlur={onBlur}
            />
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
                onValueChange={setValue}
                startContent={row.index === 0 || column.id === "A" ? <Header color="#3f3f46" /> : null}
                onBlur={onBlur}
            />
            </motion.div>
        );
    }
});
export default CellRenderer;