import { v4 as uuidv4 } from 'uuid'

export default function Table ({ rows, columns }: {
    rows: Array<Array<{id: string, value: string}>>,
    columns: Array<{id: string, value: string}>,
}) {
    return (
        <table>
            <thead>
                <tr>
                    {
                        columns && columns.map(column => {
                            return <th scope="col" key={uuidv4()}>
                                        <input type='text' id={column.id} name={column.id} defaultValue={column.value}></input>
                                    </th>
                        })
                    }
                </tr>
            </thead>
            <tbody>
                    {
                        rows && rows.map(row => {
                            return <tr key={uuidv4()}>
                                {
                                    row.map((cell, index) => {
                                        if (index === 0) {
                                            return <th key={uuidv4()}>
                                                <input type='text' id={cell.id} name={cell.id} defaultValue={cell.value}></input>
                                            </th>
                                        }
                                        return <td key={uuidv4()}>
                                            <input type='text' id={cell.id} name={cell.id} defaultValue={cell.value}></input>
                                        </td>
                                    })
                                }
                            </tr>
                        })
                    }
            </tbody>
        </table>
    )
}