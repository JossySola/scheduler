'use client'
import { v4 as uuidv4 } from 'uuid'

export default function Table({columns, rows} : {
    columns: Array<React.JSX.Element>,
    rows: Array<Array<React.JSX.Element>>,
}) {
    return (
        <table>
            <thead>
                <tr>
                    {columns}
                </tr>
            </thead>
            <tbody>
                {rows.map((row) => {
                    return <tr key={uuidv4()}>{row}</tr>
                })}
            </tbody>
        </table>
    )
}