"use client"

import { useMemo } from "react"
import Cell from "./cell"

export default function ColHeaders({ row, rowIndex, size }: {
    row: Map<any, any>,
    rowIndex: number,
    size: number,
}) {
    return useMemo(() => {
        return Array.from(row.values()).map((column: string, colIndex: number) => {
            return <th scope="col" key={`col${colIndex}row${rowIndex}`}>
                {
                <Cell value={column} rowIndex={rowIndex} colIndex={colIndex} />
                }
            </th>
        })
    }, [size])
}