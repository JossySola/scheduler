"use client"
import { TableContext } from "@/app/[lang]/table/context";
import { TableExtended } from "@/app/lib/utils-client";
import { DatePicker } from "@heroui/react";
import { CalendarDate, parseDate, Time } from "@internationalized/date";
import { useParams } from "next/navigation";
import { SetStateAction, useContext, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import * as zod from "zod/v4";

export default function InputDate ({ rowIndex, colIndex, setA1, A1 }: {
    rowIndex: number,
    colIndex: number,
    setA1?: React.Dispatch<SetStateAction<CalendarDate | Time | string | null>>,
    A1?: CalendarDate | Time | string | null,
}) {
    const label = `${TableExtended.indexToLabel(colIndex)}${rowIndex}`;
    const { lang } = useParams<{ lang: "en" | "es" }>();
    const { table } = useContext(TableContext);
    const [ date, setDate ] = useState<CalendarDate | null | undefined>(() => {
        const storedValue = table.rows[rowIndex].get(label)?.value;
        const verification = zod.iso.date().safeParse(storedValue);
        if (storedValue && verification.success) {
            return parseDate(storedValue);
        } else {
            return null;
        }
    });
    const [ isDuplicate, setIsDuplicate ] = useState<boolean>(false);

    const debounced = useDebouncedCallback(() => {
        // Re-fetches the value from the Table class
        setDate(() => {
            const storedValue = table.rows[rowIndex].get(label)?.value;
            const verification = zod.iso.date().safeParse(storedValue);
            if (storedValue && verification.success) {
                return parseDate(storedValue);
            } else {
                return null;
            }
        });
    }, 500);
    useEffect(() => debounced(), [A1]);

    const handleDateChange = useDebouncedCallback((date: CalendarDate | null) => {
        if (date) {
            table.edit(colIndex, rowIndex, date.toString());
        } else {
            table.edit(colIndex, rowIndex, "");
        }
        if (rowIndex === 0 && colIndex === 1 && setA1) setA1(date);
    }, 1000);
    const handleDuplicateChecking = (date: CalendarDate | null) => {
        setIsDuplicate(false);
        if (rowIndex === 0 && colIndex > 0) {
            const checking = Array.from(table.rows[0].values()).some(col => {
                const colValue = String(col.value).trim().toLowerCase();
                const typedValue = String(date).trim().toLowerCase();
                return colValue === typedValue;
            })
            setIsDuplicate(checking);
            if (checking) return;
        }
        handleDateChange(date);
        setDate(date);
    }
    return (
        <DatePicker
        id={ label }
        name={ label }
        size="lg"
        variant="flat"
        classNames={{
            innerWrapper: "w-[60vw] text-base sm:w-[204px]",
            inputWrapper: "border-medium border-transparent",
        }}
        value={ date }
        onChange={ handleDuplicateChecking }
        isInvalid={ isDuplicate }
        errorMessage={() => (
            <p>{ lang === "es" ? "Encabezado ya existe" : "Header already exists" }</p>
        )} />
    )
}