"use client"
import Cell from "./cell";
import { RowType } from "@/app/lib/utils-client";

export default function RowHeaders({ row, rowIndex }: {
    row: Map<string, RowType>,
    rowIndex: number,
}) {
    return Array.from(row.values()).map((column: RowType, colIndex: number) => {
        if (colIndex === 0) {
            return <th scope="row" className="flex flex-row items-center gap-2" key={`col${colIndex}row${rowIndex}`}>
                <div className="flex flex-row items-center justify-center gap-3">
                    <span className="text-tiny w-[1rem]">{String(rowIndex)}</span>
                    <Cell rowIndex={rowIndex} colIndex={colIndex} />
                </div>
            </th>
        }
        return <td key={`col${colIndex}row${rowIndex}`}>
            <Cell rowIndex={rowIndex} colIndex={colIndex} />
        </td>
    })
}