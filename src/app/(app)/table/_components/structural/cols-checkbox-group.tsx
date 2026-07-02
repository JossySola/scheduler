'use client'
import { useState } from "react";
import { CheckboxGroup, Checkbox } from "@react-spectrum/s2/CheckboxGroup";

export default function ColsCheckboxGroup({ previousState, column, rowHeaders, setColumnSpec }: {
    previousState: Set<string> | undefined,
    column: string,
    rowHeaders: string[][],
    setColumnSpec: (column: string, newArray: Array<string>) => void,
}) {
    const [selected, setSelected] = useState<Array<string>>(() => {
        if (previousState) return Array.from(previousState);
        return rowHeaders.map(([_, name]) => name);
    });
    
    const handleSelection = (selection: Array<string>) => {
        setColumnSpec(column, selection);
        setSelected(selection);
    }
    
    return (
        <CheckboxGroup
        label="Select the rows to be filled in this column"
        value={selected}
        onChange={handleSelection}>
            {
                rowHeaders
                ? rowHeaders.map(([coordinate, name]) => (
                    <Checkbox key={`${coordinate}.checkbox`} value={coordinate} id={coordinate}>{`${coordinate}: ${name}`}</Checkbox>
                ))
                : null
            }
        </CheckboxGroup>
    )
}