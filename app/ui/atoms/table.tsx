'use client'
export default function Table({columns, rows} : {
    columns: Array<React.JSX.Element>,
    rows: Array<React.JSX.Element>,
}) {
    return (
        <table>
            <thead>
                <tr>
                    {columns}
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    )
}