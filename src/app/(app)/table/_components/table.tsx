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
                                    <Cell value={row} index={index} />
                                </th>
                            )
                        })
                        : null
                    }
                </tr>
            </thead>
            <tbody>
                {
                    rows && rows.length > 1
                    ? rows.map((row, index) => {
                        if (index === 0) {
                            return null;
                        }
                        return (
                            <tr>
                                {
                                    row 
                                    ? row.map((cell, index) => {
                                        if (index === 0) {
                                            return (
                                                <th scope="row">
                                                    <Cell value={cell} index={index} />
                                                </th>
                                            )
                                        }
                                        return (
                                            <td>
                                                <Cell value={cell} index={index} />
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