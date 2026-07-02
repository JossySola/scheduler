'use client'
import { useState } from "react";
import { CheckboxGroup, Checkbox } from "@react-spectrum/s2/CheckboxGroup";

export default function RowsCheckboxGroup({ previousState, row, colHeaders, setRowSpec }: {
    previousState: Set<string> | undefined,
    row: string,
    colHeaders: string[][],
    setRowSpec: (row: string, newArray: Array<string>) => void,
}) {
    const [selected, setSelected] = useState<Array<string>>(() => {
        if (previousState) return Array.from(previousState);
        return colHeaders.map(([_, name]) => name);
    });

    const handleSelection = (selection: Array<string>) => {
        setRowSpec(row, selection);
        setSelected(selection);
    }
    
    return (
        <CheckboxGroup
        label="Select the columns to be filled in this row"
        value={selected}
        onChange={handleSelection}>
            {
                colHeaders
                ? colHeaders.map(([coordinate, name]) => (
                    <Checkbox key={`${coordinate}.checkbox`} value={coordinate} id={coordinate}>{`${coordinate}: ${name}`}</Checkbox>
                ))
                : null
            }
        </CheckboxGroup>
    )
}