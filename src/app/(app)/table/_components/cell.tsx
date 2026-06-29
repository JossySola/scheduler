'use client'
import DateCell from "./date-cell";
import TimeCell from "./time-cell";
import TextCell from "./text-cell";

export default function Cell({ value, rowHeadersType, colHeadersType, rowIndex, colIndex, editCell }: {
    value: string,
    rowHeadersType: string,
    colHeadersType: string,
    rowIndex: number,
    colIndex: number,
    editCell: ({ rowIndex, colIndex, value }: {
        rowIndex: number,
        colIndex: number,
        value: string,
    }) => void,
}) {
    if (rowIndex === 0 && colIndex > 0) {
        // Logic for column headers excluding the first column
        if (colHeadersType === "date") {
            return <DateCell value={value} rowIndex={rowIndex} colIndex={colIndex} editCell={editCell} />
        } else if (colHeadersType === "time") {
            return <TimeCell value={value} rowIndex={rowIndex} colIndex={colIndex} editCell={editCell} />
        }
    } else if (rowIndex > 0 && colIndex === 0) {
        // Logic for the row headers excluding the first row
        if (rowHeadersType === "date") {
            return <DateCell value={value} rowIndex={rowIndex} colIndex={colIndex} editCell={editCell} />
        } else if (rowHeadersType === "time") {
            return <TimeCell value={value} rowIndex={rowIndex} colIndex={colIndex} editCell={editCell} />
        }
    }
    return <TextCell value={value} rowIndex={rowIndex} colIndex={colIndex} editCell={editCell} />
}