"use client"
import { TableContext } from "@/app/[lang]/table/context";
import { TableExtended } from "@/app/lib/utils-client";
import { Select, SelectItem, SharedSelection } from "@heroui/react";
import { useContext, useState } from "react";

export default function InputSelect ({ rowIndex, colIndex }: {
    rowIndex: number,
    colIndex: number,
}) {
    const label = `${TableExtended.indexToLabel(colIndex)}${rowIndex}`;
    const { table } = useContext(TableContext);
    const [ selection, setSelection ] = useState<SharedSelection>(new Set([table.rows[rowIndex].get(label)?.value ?? ""]));
    const handleSelectionChange = (keys: SharedSelection) => {
        const selectedValue = Array.from(keys)[0] ?? ""
        table.edit(colIndex, rowIndex, selectedValue.toString());
        setSelection(keys);
    }
    if (table.values.size > 10) {
        return (
            <Select isVirtualized={table.values.size > 10}
            maxListboxHeight={10}
            id={ label }
            name={ label }
            variant="bordered"
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
        variant="bordered"
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