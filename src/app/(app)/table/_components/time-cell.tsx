'use client'
import { generateCellId } from "@/lib/utils";
import { Time } from "@internationalized/date";
import { TimeField } from "@react-spectrum/s2/TimeField";
import { useState } from "react";
import * as z from "zod/v4";

export default function TimeCell({ value, rowIndex, colIndex, editCell }: {
    value: string,
    rowIndex: number,
    colIndex: number,
    editCell: ({ rowIndex, colIndex, value }: {
        rowIndex: number,
        colIndex: number,
        value: string,
    }) => void,
}) {
    const [time, setTime] = useState<Time | null>(() => {
        const isTime = z.iso.time({ precision: 0 }).safeParse(value);
        if (isTime.success) {
            // Expected string form from "value": "HH:MM:SS"
            const stringToArray = value.split(":").map(item => parseInt(item, 10));
            return new Time(stringToArray[0], stringToArray[1], stringToArray[2]);
        } else {
            return null;
        }
    });
    const cellId = generateCellId(rowIndex, colIndex);
    
    const handleTimeChange = (event: Time | null) => {
        if (event) {
            editCell({
                rowIndex,
                colIndex,
                value: event.toString(),
            });
            setTime(event);
        }
    }

    return (
        <TimeField
        value={time}
        onChange={handleTimeChange}
        id={cellId}
        aria-label={`Cell field for ${cellId}`} />
    )
}