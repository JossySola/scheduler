'use client'
import { TableState } from "@/lib/definitions";
import Cell from "./cell";

export default function Table({ rows }: {
    rows: TableState,
}) {
    return (
        <table>
            <thead>
                <tr>
                    {
                        rows && rows[0]
                        ? rows[0].map((row, index) => {
                            return (
                                <th scope="col">
                                    <Cell value={row} rowIndex={0} colIndex={index} />
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
                            <tr>
                                {
                                    row 
                                    ? row.map((cell, colIndex) => {
                                        if (colIndex === 0) {
                                            return (
                                                <th scope="row">
                                                    <Cell value={cell} rowIndex={rowIndex} colIndex={colIndex} />
                                                </th>
                                            )
                                        }
                                        return (
                                            <td>
                                                <Cell value={cell} rowIndex={rowIndex} colIndex={colIndex} />
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