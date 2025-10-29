"use client"
import { motion } from "motion/react";
import { Input as InputHeroUI, SharedSelection, Spinner } from "@heroui/react";
import { Header } from "../../icons";
import { Dispatch, memo, SetStateAction, useState } from "react";
import { useParams } from "next/navigation";
import { Table } from "@tanstack/react-table";
import { VTData } from "@/app/hooks/custom";

const Input = memo(function Input({ isLoading, initialValue, handleDuplicates, isDuplicate, table, row, column }: {
    initialValue: unknown,
    handleDuplicates: (val: string) => void,
    isDuplicate: boolean,
    table: Table<VTData>,
    row: { index: number },
    column: { id: string },
    interval: number,
    headerType: SharedSelection,
    setInterval: Dispatch<SetStateAction<number>>,
    setHeaderType: Dispatch<SetStateAction<SharedSelection>>,  
    isLoading?: boolean, 
}) {
    const { lang } = useParams<{ lang: "es" | "en" }>();
    const [value, setValue] = useState<string>(initialValue as string ?? ""); 
    const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, value);
    };    
    return (
        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
            <InputHeroUI
                aria-label={ lang === "en" ? `Input field for row ${row.index} and column ${column.id}` : `Campo de entrada para fila ${row.index} y columna ${column.id}` }
                size="lg"
                variant="bordered"
                classNames={{
                mainWrapper: "w-[63vw] sm:w-64",
                inputWrapper: "h-[48px]",
                }}
                value={(value as string) ?? ""}
                onChange={e => handleDuplicates(e.target.value)}
                onValueChange={setValue}
                startContent={
                    isLoading && row.index !== 0 && column.id !== "A"
                    ? <Spinner size="md" variant="simple" color="secondary"/>
                    : row.index === 0 || column.id === "A" 
                        ? <Header color={ isDuplicate ? "oklch(57.7% 0.245 27.325)" : "#3f3f46"} /> 
                        : null
                }
                onBlur={onBlur}
                errorMessage={
                    isDuplicate 
                    ? lang === "en" 
                        ? "Duplicate header" 
                        : "Encabezado duplicado"
                    : undefined
                }
                isInvalid={isDuplicate}
            />
        </motion.div>
    )
});
export default Input;