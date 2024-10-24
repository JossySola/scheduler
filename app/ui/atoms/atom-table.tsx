'use client'
import { v4 as uuidv4 } from 'uuid'

export default function Table({columns, rows} : {
    columns: Array<React.JSX.Element>,
    rows: Array<Array<React.JSX.Element>>,
}) {
    return (
        <table className='text-black'>
            <thead>
                <tr>
                    {columns}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, index) => {
                    return <tr key={uuidv4()} id={`${index+1}`}>{row}</tr>
                })}
            </tbody>
        </table>
    )
}