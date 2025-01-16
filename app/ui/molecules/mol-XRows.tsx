"use client"
import { v4 as uuidv4 } from "uuid";
import { SetStateAction } from "react";

export default function XRows ({
    existingRows,
    setRows,
    values,
}: { existingRows: Array<Array<string>>, setRows: React.Dispatch<SetStateAction<string[][]>>, values?: Array<string> }) {
    // display rows dynamically based on data received
    // dynamically add and remove
    return (
        <>
        {
            existingRows && existingRows.map((row, rIndex) => {
                // At index 0, create table header
                if (rIndex === 0) {
                    return (
                        <thead key={rIndex}>
                            <tr>
                                {
                                    row && row.map((column, cIndex) => {
                                        return (
                                        <th scope="col" key={cIndex}>
                                            <RowInput rIndex={rIndex} cIndex={cIndex} value={column} setNewValue={setRows} currentRows={existingRows} />
                                        </th>)
                                    })
                                }
                            </tr>
                        </thead>
                    )
                }
                // If it is not the first row, create rows inside the table body
                return (
                    <tbody key={rIndex}>
                        <tr>
                            {
                                row && row.map((column, cIndex) => {
                                    if (cIndex === 0) {
                                        return (
                                        <th scope="row" key={cIndex}>
                                            <RowInput rIndex={rIndex} cIndex={cIndex} value={column} setNewValue={setRows} currentRows={existingRows} />
                                        </th>)
                                    }
                                    return (
                                    <td key={cIndex}>
                                        <RowInput rIndex={rIndex} cIndex={cIndex} value={column} setNewValue={setRows} currentRows={existingRows} values={values && values} />
                                    </td>)
                                })
                            }
                        </tr>
                    </tbody>
                )
            })
        }
        </>
    )
}

const RowInput = ({ rIndex, cIndex, value, setNewValue, currentRows, values } : 
    { 
        rIndex: number,
        cIndex: number, 
        value: string, 
        setNewValue: React.Dispatch<SetStateAction<string[][]>>, 
        currentRows: Array<Array<string>>,
        values?: Array<string>,
    }) => {
    const columnNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const columnName = `${columnNames[cIndex]}${rIndex}`;

    if (values && values.length) {
        return (
            <select 
            id={`${rIndex}-${cIndex}-selection`} 
            value={value} 
            onChange={(e) => {
                e.preventDefault();
                setNewValue(() => {
                    return currentRows && currentRows.map((row, rowIndex) => {
                        if (rIndex !== rowIndex) {
                            return row;
                        }
                        return row && row.map((column, colIndex) => {
                            if (cIndex !== colIndex) {
                                return column;
                            }
                            return value;
                        })
                    })
                })
            }}
            >
                <option value="">Select</option>
                {
                    values.map(value => {
                        return <option key={`${uuidv4()}`} value={value}>{value}</option>
                    })
                }
            </select>
        )
    }

    return <input type="text" key={columnName} id={columnName} name={columnName} value={value} autoComplete="off" onChange={(e) => {
        e.preventDefault();
        setNewValue(() => {
            return currentRows && currentRows.map((row, rowIndex) => {
                if (rIndex !== rowIndex) {
                    return row;
                }
                return row && row.map((column, colIndex) => {
                    if (cIndex !== colIndex) {
                        return column;
                    }
                    return e.target.value;
                })
            })
        })
    }}/>
}