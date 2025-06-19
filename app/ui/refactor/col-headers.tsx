"use client"
import Cell from "./cell";
import { RowType, TableExtended } from "@/app/lib/utils-client";

export default function ColHeaders({ row, rowIndex }: {
    row: Map<string, RowType>,
    rowIndex: number,
}) {
    return Array.from(row.values()).map((column: RowType, colIndex: number) => {
        return <th scope="col" key={`col${colIndex}row${rowIndex}`} className="flex flex-col justify-center items-center gap-2" >
            <span className="text-tiny">{TableExtended.indexToLabel(colIndex)}</span>
            <div className="flex flex-row items-center gap-3">
                { colIndex === 0 && <span className="text-tiny w-[1rem]">{String(rowIndex)}</span> }
                { <Cell element={column} rowIndex={rowIndex} colIndex={colIndex} /> }
            </div>
        </th>
    })
}