'use client'
import { generateCellId } from "@/lib/utils";
import { CalendarDate, DateValue, parseDate } from "@internationalized/date";
import { DatePicker } from "@react-spectrum/s2/DatePicker";
import { useState } from "react";
import * as z from "zod/v4";

export default function DateCell({ value, rowIndex, colIndex, editCell }: {
    value: string,
    rowIndex: number,
    colIndex: number,
    editCell: ({ rowIndex, colIndex, value }: {
        rowIndex: number,
        colIndex: number,
        value: string,
    }) => void
}) {
    const [date, setDate] = useState<CalendarDate | null>(() => {
        const isDate = z.iso.date().safeParse(value);
        if (isDate.success) {
            return parseDate(value);
        } else {
            return null;
        }
    });
    const cellId = generateCellId(rowIndex, colIndex);
    
    const handleDateChange = (event: DateValue | null) => {
        if (event) {
            editCell({
                rowIndex,
                colIndex,
                value: event.toString(),
            })
            const newDate = parseDate(event.toString());
            setDate(newDate);
        }
    }

    return (
        <DatePicker 
        value={date} 
        onChange={handleDateChange} 
        id={cellId}
        aria-label={`Cell field for ${cellId}`}
        autoComplete="off" />
    )
}