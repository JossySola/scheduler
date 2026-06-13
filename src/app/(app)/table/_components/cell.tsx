'use client'
import { HeaderType } from "@/lib/definitions";
import { generateColumnName } from "@/lib/utils";
import { ChangeEvent, useState } from "react";
import { Input } from "react-aria-components";

export default function Cell({ value, rowIndex, colIndex, editCell }: {
    value: string | HeaderType,
    rowIndex: number,
    colIndex: number,
    editCell: ({ rowIndex, colIndex, value, type, isVisible}: {
        rowIndex: number,
        colIndex: number,
        value?: string | undefined,
        type?: "text" | "time" | "date" | undefined,
        isVisible?: boolean | undefined,
    }) => void,
}) {
    const [text, setText] = useState("");
    const handleChange = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        event.preventDefault();
        const newValue = event.target.value;
        const payload = {
            rowIndex,
            colIndex,
            value: newValue,
        }
        editCell(payload);
    }
    return (
        <Input 
        id={`${generateColumnName(colIndex)}${rowIndex}`}
        aria-label={`Cell field for ${generateColumnName(colIndex)}${rowIndex}`}
        value={text} 
        onChange={e => setText(e.target.value)}
        autoComplete="off"
        className="bg-gray-500" />
    )
}