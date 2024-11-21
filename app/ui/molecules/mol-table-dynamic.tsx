import { v4 as uuidv4 } from 'uuid'

export default function DynamicTable ({ rows, columns, handleInputChange }: {
    rows: Array<Array<{id: string, value: string}>>,
    columns: Array<{id: string, value: string}>,
    handleInputChange: (rowIndex: number, colIndex: number, newValue: string) => void,
}) {
    return (
        <table className='text-black'>
            <thead>
                <tr>
                    {
                        columns && columns.map((column, index) => {
                            return <th scope="col" key={uuidv4()}>
                                        <input type='text' id={column.id} name={column.id} defaultValue={column.value} onChange={(event) => {
                                            handleInputChange(0, index, event.target.value);
                                        }}></input>
                                    </th>
                        })
                    }
                </tr>
            </thead>
            <tbody>
                    {
                        rows && rows.map((row, rowIndex) => {
                            return <tr key={uuidv4()}>
                                {
                                    row.map((cell, colIndex) => {
                                        if (colIndex === 0) {
                                            return <th key={uuidv4()}>
                                                <input type='text' id={cell.id} name={cell.id} defaultValue={cell.value} onChange={(event) => {
                                                    handleInputChange(rowIndex, colIndex, event.target.value);
                                                }}></input>
                                            </th>
                                        }
                                        return <td key={uuidv4()}>
                                            <input type='text' id={cell.id} name={cell.id} defaultValue={cell.value} onChange={(event) => {
                                                    handleInputChange(rowIndex, colIndex, event.target.value);
                                                }}></input>
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