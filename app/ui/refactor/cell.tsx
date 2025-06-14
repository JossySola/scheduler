"use client"
import { TableContext } from "@/app/[lang]/table/context";
import { DynamicTable } from "@/app/lib/utils-client";
import { Input } from "@heroui/react";
import { memo, useContext } from "react";
import { useDebouncedCallback } from "use-debounce";

const Cell = memo(function ({ value, rowIndex, colIndex }: { 
    value: string,
    rowIndex: number,
    colIndex: number,
}) {
    const { table } = useContext(TableContext);
    const debouncedModification = useDebouncedCallback((value: string) => {
        table.modifyCell(colIndex, rowIndex, value);
        if (colIndex === 0) {
            table.updateRowTab(rowIndex, "name", value);
        }
        if (rowIndex === 0) {
            table.updateColTab(colIndex, "name", value);
        }
    }, 1000);
    return <Input 
        defaultValue={ value }
        name={`${DynamicTable.indexToLabel(colIndex)}${rowIndex}`}
        type="text"
        size="lg"
        autoComplete="off"
        isClearable
        variant={ rowIndex === 0 || colIndex === 0 ? "flat" : "bordered" }
        classNames={{
            input: "w-[60vw] text-2xl sm:text-base sm:w-[204px]",
            innerWrapper: `${rowIndex === 0 || colIndex === 0 ? "border-medium border-transparent" : ""}`
        }}
        onValueChange={(value: string) => debouncedModification(value)}
    />
})

export default Cell;