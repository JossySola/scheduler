'use client'
import { generateCellId } from "@/lib/utils";
import { TextField } from "@react-spectrum/s2/TextField";
import { useState } from "react";

export default function TextCell({ value, rowIndex, colIndex, editCell }: {
    value: string,
    rowIndex: number,
    colIndex: number,
    editCell: ({ rowIndex, colIndex, value }: {
        rowIndex: number,
        colIndex: number,
        value: string,
    }) => void,
}) {
    const [text, setText] = useState<string>(value);
    const cellId = generateCellId(rowIndex, colIndex);
    
    const handleTextChange = (event: string) => {
        editCell({
            rowIndex,
            colIndex,
            value: event,
        });
        setText(event);
    }

    return (
        <TextField 
        id={cellId}
        aria-label={`Cell field for ${cellId}`}
        value={text} 
        onChange={handleTextChange}
        autoComplete="off" />
    )
}