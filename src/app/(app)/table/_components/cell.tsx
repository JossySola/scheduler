'use client'
import { HeaderType } from "@/lib/definitions";
import { generateCellId } from "@/lib/utils";
import { TextField } from "@react-spectrum/s2/TextField";

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
    const text = (
        typeof value === 'string'
        ? value
        : value.value
    );
    const cellId = generateCellId(rowIndex, colIndex);
    const handleChange = (event: string) => {
        const newValue = event;
        const payload = {
            rowIndex,
            colIndex,
            value: newValue,
        }
        editCell(payload);
    }
    return (
        <TextField 
        id={cellId}
        aria-label={`Cell field for ${cellId}`}
        value={text} 
        onChange={handleChange}
        autoComplete="off" />
    )
}
