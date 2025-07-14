"use client"
import { TableContext } from "@/app/[lang]/table/context";
import { TableExtended } from "@/app/lib/utils-client";
import { Select, SelectItem, SharedSelection } from "@heroui/react";
import { useContext, useEffect, useState } from "react";

export default function InputSelect ({ rowIndex, colIndex }: {
    rowIndex: number,
    colIndex: number,
}) {
    const label = `${TableExtended.indexToLabel(colIndex)}${rowIndex}`;
    const { table, generatedRows } = useContext(TableContext);

    const getCurrentValue = () => {
        const value = table.rows[rowIndex].get(label)?.value ?? "";
        return new Set([value]);
    }
    const getCurrentConflict = () => {
        return table.rows[rowIndex].get(label)?.hasConflict ?? false;
    }

    useEffect(() => {
        const currentValue = table.rows[rowIndex].get(label)?.value ?? "";
        const currentConflict = table.rows[rowIndex].get(label)?.hasConflict ?? false;
        setSelection(new Set([currentValue]));
        setConflict(currentConflict);
    }, [generatedRows]);

    const [ selection, setSelection ] = useState<SharedSelection>(getCurrentValue);
    const [ conflict, setConflict ] = useState<boolean>(getCurrentConflict);
    
    const handleSelectionChange = (keys: SharedSelection) => {
        const selectedValue = Array.from(keys)[0] ?? "";
        table.edit(colIndex, rowIndex, selectedValue.toString());
        setSelection(keys);
        if (conflict) setConflict(false);
    }

    if (table.values.size > 10) {
        return (
            <Select isVirtualized={table.values.size > 10}
            maxListboxHeight={10}
            id={ label }
            name={ label }
            variant={ conflict ? "faded" : "bordered" }
            color={ conflict ? "warning" : "default" }
            size="lg"
            classNames={{
                innerWrapper: "w-[60vw] text-base sm:w-[204px]",
                trigger: "h-[48px]"
            }}
            selectedKeys={ selection }
            onSelectionChange={ handleSelectionChange }>
                {
                    Array.from(table.values).map((value, index) => (
                        <SelectItem key={index} textValue={value}>
                            { value }
                        </SelectItem>
                    ))
                }
            </Select>
        )
    }
    return (
        <Select
        id={ label }
        name={ label }
        variant={ conflict ? "faded" : "bordered" }
        color={ conflict ? "warning" : "default"}
        size="lg"
        classNames={{
            innerWrapper: "w-[60vw] text-base sm:w-[204px]",
            trigger: "h-[48px]"
        }}
        selectedKeys={ selection }
        onSelectionChange={ handleSelectionChange }>
            {
                Array.from(table.values).map((value, index) => (
                    <SelectItem key={index} textValue={value}>
                        { value }
                    </SelectItem>
                ))
            }
        </Select>
    )
}