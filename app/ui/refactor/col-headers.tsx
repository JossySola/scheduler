"use client"
import { useMemo } from "react"
import Cell from "./cell"

export default function ColHeaders({ row, rowIndex, size }: {
    row: Map<any, any>,
    rowIndex: number,
    size: number,
}) {
    return useMemo(() => {
        return Array.from(row.entries()).map(([key, value]: [any, any], colIndex: number) => {
            return <th scope="col" key={`col${colIndex}row${rowIndex}`} className="flex flex-col justify-center items-center gap-2" >
                <span className="text-tiny">{String(key)}</span>
                <div className="flex flex-row items-center gap-3">
                    { colIndex === 0 && <span className="text-tiny w-[1rem]">{String(rowIndex)}</span> }
                    { <Cell value={value} rowIndex={rowIndex} colIndex={colIndex} /> }
                </div>
            </th>
        })
    }, [size])
}