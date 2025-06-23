"use client"
import { TableContext } from "@/app/[lang]/table/context";
import { RowType, TableExtended } from "@/app/lib/utils-client";
import { Input } from "@heroui/react";
import { memo, useContext } from "react";
import { useDebouncedCallback } from "use-debounce";

const Cell = memo(function ({ element, rowIndex, colIndex }: { 
    element: RowType,
    rowIndex: number,
    colIndex: number,
}) {
    const { table } = useContext(TableContext);
    const debouncedModification = useDebouncedCallback((value: string) => {
        table.edit(colIndex, rowIndex, value);
    }, 1000);
    return <Input 
        defaultValue={ element.value }
        id={`${TableExtended.indexToLabel(colIndex)}${rowIndex}`}
        name={`${TableExtended.indexToLabel(colIndex)}${rowIndex}`}
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