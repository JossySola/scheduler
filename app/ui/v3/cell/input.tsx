"use client"
import { TableContext } from "@/app/[lang]/table/context";
import { TableExtended } from "@/app/lib/utils-client";
import { Input } from "@heroui/react";
import { useContext, useState } from "react";

export default function InputValue ({ rowIndex, colIndex }: {
    rowIndex: number,
    colIndex: number,
}) {
    const label = `${TableExtended.indexToLabel(colIndex)}${rowIndex}`;
    const { table } = useContext(TableContext);
    const [ value, setValue ] = useState<string>(table.fetch(colIndex, rowIndex) ?? "");
    const handleInputChange = (value: string) => {
        table.edit(colIndex, rowIndex, value);
        setValue(value);
    };
    return <Input isClearable
    id={ label }
    name={ label }
    type="text"
    size="lg"
    autoComplete="off"
    variant={ colIndex === 0 ? "flat" : "bordered" }
    classNames={{
        input: "w-[60vw] text-base sm:w-[204px]",
    }}
    value={ value }
    onValueChange={ handleInputChange } />
}