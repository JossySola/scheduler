"use client"
import { TableContext } from "@/app/[lang]/table/context";
import { TableExtended } from "@/app/lib/utils-client";
import { TimeInput } from "@heroui/react";
import { SetStateAction, useContext, useEffect, useState } from "react";
import { ClockDashed } from "../../icons";
import { CalendarDate, parseTime, Time } from "@internationalized/date";
import { useDebouncedCallback } from "use-debounce";
import * as zod from "zod/v4";
import { useParams } from "next/navigation";

export default function InputTime ({ rowIndex, colIndex, setA1, A1 }: {
    rowIndex: number,
    colIndex: number,
    setA1?: React.Dispatch<SetStateAction<CalendarDate | Time | string | null>>,
    A1?: CalendarDate | Time | string | null,
}) {
    const label = `${TableExtended.indexToLabel(colIndex)}${rowIndex}`;
    const { lang } = useParams<{ lang: "en" | "es" }>();
    const { table } = useContext(TableContext);
    const [ value, setValue ] = useState<Time | null>(() => {
        const storedValue = table.rows[rowIndex].get(label)?.value;
        const verification = zod.iso.time().safeParse(storedValue);
        if (storedValue && verification.success) {
            return parseTime(storedValue);
        } else {
            return null;
        }
    });
    const [ isDuplicate, setIsDuplicate ] = useState<boolean>(false);
    const debounced = useDebouncedCallback(() => {
        // Re-fetches the value from the Table class
        setValue(() => {
            const storedValue = table.rows[rowIndex].get(label)?.value;
            const verification = zod.iso.time().safeParse(storedValue);
            if (storedValue && verification.success) {
                return parseTime(storedValue);
            } else {
                return null;
            }
        })
    }, 500);
    useEffect(() => debounced(), [A1]);

    const handleTimeChange = useDebouncedCallback((time: Time | null) => {
        if (time) {
            table.edit(colIndex, rowIndex, time.toString());
        } else {
            table.edit(colIndex, rowIndex, "");
        }
        if (rowIndex === 0 && colIndex === 1 && setA1) setA1(time);
    }, 1000);
    const handleDuplicateChecking = (time: Time | null) => {
        setIsDuplicate(false);
        if (rowIndex === 0 && colIndex > 0) {
            const checking = Array.from(table.rows[0].values()).some(col => {
                const colValue = String(col.value).trim().toLowerCase();
                const typedValue = String(time).trim().toLowerCase();
                return colValue === typedValue;
            })
            setIsDuplicate(checking);
            if (checking) return;
        }
        handleTimeChange(time);
        setValue(time);
    }
    return (
        <TimeInput
        id={ label }
        name={ label }
        size="lg"
        variant="flat"
        classNames={{
            innerWrapper: "w-[60vw] text-base sm:w-[204px]",
            inputWrapper: "border-medium border-transparent",
        }}
        startContent={ <ClockDashed /> }
        value={ value }
        onChange={ handleDuplicateChecking }
        isInvalid={ isDuplicate }
        errorMessage={() => (
            <p>{ lang === "es" ? "Encabezado ya existe" : "Header already exists" }</p>
        )} />
    )
}