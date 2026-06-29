'use client'
import { TableState } from "@/lib/definitions";
import Cell from "./cell";
import { generateCellId, generateColumnName } from "@/lib/utils";

export default function Table({ rows, rowHeadersType, colHeadersType, editCell }: {
    rows: TableState,
    rowHeadersType: string,
    colHeadersType: string,
    editCell: ({ rowIndex, colIndex, value}: {
        rowIndex: number,
        colIndex: number,
        value: string,
    }) => void,
}) {

    return (
        <table>
            <thead>
                <tr className="flex flex-row gap-2">
                    {
                        rows && rows[0]
                        ? rows[0].map((col, index) => {
                            return (
                                <th scope="col" key={generateCellId(0, index)}>
                                    <span aria-label="Column Name">{`${generateColumnName(index)}`}</span>
                                    <Cell value={col} rowIndex={0} colIndex={index} rowHeadersType={rowHeadersType} colHeadersType={colHeadersType} editCell={editCell} />
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
                            <tr className="flex flex-row gap-2" key={`row-${rowIndex}`}>
                                {
                                    row 
                                    ? row.map((cell, colIndex) => {
                                        if (colIndex === 0) {
                                            return (
                                                <th scope="row" key={generateCellId(rowIndex, colIndex)}>
                                                    <Cell value={cell} rowIndex={rowIndex} colIndex={colIndex} rowHeadersType={rowHeadersType} colHeadersType={colHeadersType} editCell={editCell} />
                                                </th>
                                            )
                                        }
                                        return (
                                            <td key={generateCellId(rowIndex, colIndex)}>
                                                <Cell value={cell} rowIndex={rowIndex} colIndex={colIndex} rowHeadersType={rowHeadersType} colHeadersType={colHeadersType} editCell={editCell} />
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
