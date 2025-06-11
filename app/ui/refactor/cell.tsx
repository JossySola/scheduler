"use client"
import { TableContext } from "@/app/[lang]/table/context";
import { Table } from "@/app/lib/utils-client";
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
        table.modifyCell(colIndex, rowIndex, value)
    }, 1000);
    return <Input 
        defaultValue={ value }
        name={`${Table.indexToLabel(colIndex)}${rowIndex}`}
        type="text"
        onValueChange={(value: string) => debouncedModification(value)}
    />
})

export default Cell;