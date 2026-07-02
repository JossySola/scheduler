'use client'
import { NumberField } from "@react-spectrum/s2/NumberField";
import { useState } from "react";

export default function ColCountSetting ({value, column, rowsLength, valuesInColumns, editCountInColumn}: {
    value: string,
    column: string,
    rowsLength: number,
    valuesInColumns: Map<string, Map<string, number>>,
    editCountInColumn: (column: string, value: string, count: number) => void,
}) {
    const [newCount, setNewCount] = useState<number>(() => {
        const headerExists = valuesInColumns.has(column);
        if (headerExists) {
            const header = valuesInColumns.get(column)!;
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
        editCountInColumn(column, value, e);
    }
    return (
        <>
            <span className="w-1/5 text-2xl text-center truncate">{ value }</span>
            <NumberField
            aria-labelledby="col-setting-description" 
            minValue={0} 
            maxValue={rowsLength}
            value={newCount}
            onChange={handleChange} />
        </>
    )
}