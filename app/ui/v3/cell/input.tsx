"use client"
import { TableContext } from "@/app/[lang]/table/context";
import { TableExtended } from "@/app/lib/utils-client";
import { Input } from "@heroui/react";
import { useParams } from "next/navigation";
import { useContext, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function InputValue ({ rowIndex, colIndex }: {
    rowIndex: number,
    colIndex: number,
}) {
    const label = `${TableExtended.indexToLabel(colIndex)}${rowIndex}`;
    const { lang } = useParams<{ lang: "en" | "es" }>();
    const { table } = useContext(TableContext);
    const [ isDuplicate, setIsDuplicate ] = useState<boolean>(false);
    const [ value, setValue ] = useState<string>(table.rows[rowIndex].get(label)?.value ?? "");
    const [ conflict, setConflict ] = useState<boolean>(table.rows[rowIndex].get(label)?.conflict ?? false);
    const handleInputChange = useDebouncedCallback((value: string) => {
        table.edit(colIndex, rowIndex, value);
    }, 1000);
    const handleDuplicateChecking = (value: string) => {
        setIsDuplicate(false);
        if (rowIndex === 0 || colIndex === 0) {
            if (rowIndex === 0 && colIndex > 0) {
                const checking = Array.from(table.rows[0].values()).some(row => {
                    const rowValue = String(row.value).trim().toLowerCase();
                    const typedValue = String(value).trim().toLowerCase();
                    return rowValue === typedValue;
                })
                setIsDuplicate(checking);
                if (checking) return;
            }
            if (colIndex === 0) {
                const checking = Array.from(table.rows.entries()).some(([index, data]) => {
                    if (rowIndex !== index && index !== 0) {
                        const rowRaw = data.get(`A${index}`)?.value;
                        if (!rowRaw) return false;
                        const typedRaw = value;

                        const rowValue = String(rowRaw).trim().toLowerCase();
                        const typedValue = String(typedRaw).trim().toLowerCase();
                        
                        return rowValue === typedValue;
                    }
                    return false;
                })
                setIsDuplicate(checking);
                if (checking) return;
            }
            handleInputChange(value);
            setValue(value);
            if (conflict) setConflict(false);
        }
    }
    return <Input
    id={ label }
    name={ label }
    type="text"
    size="lg"
    color={ conflict ? "warning" : "default" }
    autoComplete="off"
    variant={ rowIndex === 0 || colIndex === 0 ? "flat" : "bordered" }
    classNames={{
        input: rowIndex === 0 || colIndex === 0 ? "w-[60vw] text-base sm:w-[204px] h-[24px] " : "w-[60vw] text-base sm:w-[204px]",
        inputWrapper: rowIndex === 0 || colIndex === 0 ? "border-medium border-transparent" : ""
    }}
    value={ value }
    onValueChange={ handleDuplicateChecking }
    isInvalid={ isDuplicate }
    errorMessage={() => (
        <p>{ lang === "es" ? "Encabezado ya existe" : "Header already exists" }</p>
    )} />
}