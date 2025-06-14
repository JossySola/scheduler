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
                return <th scope="row" className="flex flex-row items-center gap-2" key={`col${colIndex}row${rowIndex}`}>
                    <div className="flex flex-row items-center justify-center gap-3">
                        <span className="text-tiny w-[1rem]">{String(rowIndex)}</span>
                        <Cell value={column} rowIndex={rowIndex} colIndex={colIndex} />
                    </div>
                </th>
            }
            return <td key={`col${colIndex}row${rowIndex}`}>
                <Cell value={column} rowIndex={rowIndex} colIndex={colIndex} />
            </td>
        })
    }, [size]);
}