'use client'
import { TableState } from "@/lib/definitions";
import Cell from "./cell";
import { generateColumnName } from "@/lib/utils";

export default function Table({ rows, editCell }: {
    rows: TableState,
    editCell: ({ rowIndex, colIndex, value, type, isVisible}: {
        rowIndex: number,
        colIndex: number,
        value?: string | undefined,
        type?: "text" | "time" | "date" | undefined,
        isVisible?: boolean | undefined,
    }) => void,
}) {
    return (
        <table>
            <thead>
                <tr className="flex flex-row gap-2">
                    {
                        rows && rows[0]
                        ? rows[0].map((row, index) => {
                            return (
                                <th scope="col" key={`${generateColumnName(index)}${0}`}>
                                    <Cell value={row} rowIndex={0} colIndex={index} editCell={editCell} />
                                </th>
                            )
                        })
                        : null
                    }
                </tr>
            </thead>
            <tbody>
                {
                    rows && rows.length > 0
                    ? rows.map((row, rowIndex) => {
                        if (rowIndex === 0) {
                            return null;
                        }
                        return (
                            <tr className="flex flex-row gap-2" key={rowIndex}>
                                {
                                    row 
                                    ? row.map((cell, colIndex) => {
                                        if (colIndex === 0) {
                                            return (
                                                <th scope="row" key={`${generateColumnName(colIndex)}${0}`}>
                                                    <Cell value={cell} rowIndex={rowIndex} colIndex={colIndex} editCell={editCell} />
                                                </th>
                                            )
                                        }
                                        return (
                                            <td key={`${generateColumnName(colIndex)}${0}`}>
                                                <Cell value={cell} rowIndex={rowIndex} colIndex={colIndex} editCell={editCell} />
                                            </td>
                                        )
                                    })
                                    : null
                                }
                            </tr>
                        )
                    })
                    : null
                }
            </tbody>
        </table>
    )
}