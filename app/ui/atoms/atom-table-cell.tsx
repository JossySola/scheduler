"use client"
import { Input } from "@heroui/react";

export default function TableCellInput ({ name, value, onChange, rowIndex, colIndex, variant = "bordered" }: {
    name: string,
    value: string,
    onChange: ( e: React.ChangeEvent<HTMLInputElement>) => void,
    rowIndex: number,
    colIndex: number,
    variant?: "bordered" | "flat" | "faded" | "underlined"
}) {
    // I created this separate component solely for the <input> as on every re-render the field would lose focus
    return <Input 
    name={ name }
    key={ `${rowIndex}-${colIndex}` }
    className="w-max"
    variant={ variant } 
    size="sm"
    type="text"
    value={ value } 
    autoComplete="off" 
    onChange={ onChange }/>
}