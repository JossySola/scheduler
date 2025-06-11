"use client"

import { useMemo } from "react"
import Cell from "./cell"

export default function RowHeaders({ row, rowIndex, size }: {
    row: Map<any, any>,
    rowIndex: number,
    size: number
}) {
    return useMemo(() => {
        return Array.from(row.values()).map((column: string, colIndex: number) => {
            if (colIndex === 0) {
                return <th scope="row" key={`col${colIndex}row${rowIndex}`}>
                    <Cell value={column} rowIndex={rowIndex} colIndex={colIndex} />
                </th>
            }
            return <td key={`col${colIndex}row${rowIndex}`}>
                <Cell value={column} rowIndex={rowIndex} colIndex={colIndex} />
            </td>
        })
    }, [size]);
}