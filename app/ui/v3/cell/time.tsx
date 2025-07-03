"use client"
import { TableContext } from "@/app/[lang]/table/context";
import { TableExtended } from "@/app/lib/utils-client";
import { TimeInput } from "@heroui/react";
import { SetStateAction, useContext, useEffect, useState } from "react";
import { ClockDashed } from "../../icons";
import { CalendarDate, parseTime, Time } from "@internationalized/date";
import { useDebouncedCallback } from "use-debounce";
import * as zod from "zod/v4";

export default function InputTime ({ rowIndex, colIndex, setA1, A1 }: {
    rowIndex: number,
    colIndex: number,
    setA1?: React.Dispatch<SetStateAction<CalendarDate | Time | string | null>>,
    A1?: CalendarDate | Time | string | null,
}) {
    const label = `${TableExtended.indexToLabel(colIndex)}${rowIndex}`;
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
    const debounced = useDebouncedCallback(() => {
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
    const handleTimeChange = (time: Time | null) => {
        if (time) {
            table.edit(colIndex, rowIndex, time.toString());
        } else {
            table.edit(colIndex, rowIndex, "");
        }
        if (rowIndex === 0 && colIndex === 1 && setA1) setA1(time);
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
        onChange={ handleTimeChange } />
    )
}