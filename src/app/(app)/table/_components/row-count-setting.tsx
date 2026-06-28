'use client'

import { NumberField } from "@react-spectrum/s2/NumberField";
import { useState } from "react"

export default function RowCountSetting ({value, row, colsLength, valuesInRows, editCountInRow}: {
    value: string,
    row: string,
    colsLength: number,
    valuesInRows: Map<string, Map<string, number>>,
    editCountInRow: (row: string, value: string, count: number) => void,
}) {
    const [newCount, setNewCount] = useState<number>(() => {
        const headerExists = valuesInRows.has(row);
        if (headerExists) {
            const header = valuesInRows.get(row)!;
            const valueExists = header.has(value);
            if (valueExists) {
                return header.get(value)!;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    });
    const handleChange = (e: number) => {
        setNewCount(e);
        editCountInRow(row, value, e);
    }
    return (
        <>
            <span className="w-1/5 text-2xl text-center truncate">{ value }</span>
            <NumberField
            aria-labelledby="row-setting-description"
            minValue={0}
            maxValue={colsLength}
            value={newCount}
            onChange={handleChange} />
        </>
    )
}