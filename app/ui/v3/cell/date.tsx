"use client"
import { TableContext } from "@/app/[lang]/table/context";
import { TableExtended } from "@/app/lib/utils-client";
import { DatePicker } from "@heroui/react";
import { CalendarDate, parseDate, Time } from "@internationalized/date";
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
    const { table } = useContext(TableContext);
    const [ date, setDate ] = useState<CalendarDate | null>(() => {
        const storedValue = table.fetch(colIndex, rowIndex);
        const verification = zod.iso.date().safeParse(storedValue);
        if (storedValue && verification.success) {
            return parseDate(storedValue);
        } else {
            return null;
        }
    });
    const debounced = useDebouncedCallback(() => {
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
    const handleDateChange = (date: CalendarDate | null) => {
        if (date) {
            table.edit(colIndex, rowIndex, date.toString());
        } else {
            table.edit(colIndex, rowIndex, "");
        }
        if (rowIndex === 0 && colIndex === 1 && setA1) setA1(date);
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
        onChange={ handleDateChange } />
    )
}