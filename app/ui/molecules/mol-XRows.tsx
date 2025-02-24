"use client"
import { SetStateAction, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input, Select, SelectItem } from "@heroui/react";

export default function XRows ({ existingRows, setRows, values, cols }: { 
    existingRows: Array<Array<string>>, 
    setRows: React.Dispatch<SetStateAction<string[][]>>, 
    values?: Array<string>, 
    cols?: Array<number> 
}) {
    const [ colsCriteria, setColsCriteria ] = useState<Array<number>>(existingRows.length ? 
        existingRows[0].map(() => existingRows.length ) : []);
    const params = useParams();
    const lang = params.lang ? params.lang : "en";

    useEffect(() => {
        if (cols) {
            setColsCriteria(cols);
        }
    }, [])

    useEffect(() => {
        setColsCriteria(prev => [...prev, existingRows.length]);
    }, [existingRows])
    
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
                                        <th scope="col" key={cIndex} className="align-top p-1">
                                            <RowInput rIndex={rIndex} cIndex={cIndex} value={column} setNewValue={setRows} currentRows={existingRows} />
                                            {
                                                cIndex !== 0 ? (
                                                    <>
                                                    <label className="text-tiny">{ lang === "es" ? "Número de filas a llenar" : "Number of rows to fill" }</label>
                                                    <input 
                                                    className="bg-[transparent] text-center" 
                                                    type="number" 
                                                    name={`Specification:Column:${existingRows[0] ? existingRows[0][cIndex] : ""}-must-have-this-amount-of-cells-filled-in`} 
                                                    min={0} 
                                                    max={existingRows && existingRows.length ? existingRows.length - 1 : 0} 
                                                    value={colsCriteria[cIndex]} 
                                                    onChange={e => {
                                                        setColsCriteria(colsCriteria && colsCriteria.map((col, index) => {
                                                            if (index === cIndex) {
                                                                const num = parseInt(e.target.value, 10);
                                                                return num;
                                                            }
                                                            return col;
                                                        }))
                                                    }}/>
                                                    </>
                                                ) : null
                                            }    
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
                                        <th scope="row" key={cIndex} className="align-top p-1">
                                            <RowInput rIndex={rIndex} cIndex={cIndex} value={column} setNewValue={setRows} currentRows={existingRows} />
                                        </th>)
                                    }
                                    return (
                                    <td key={cIndex} className="align-top p-1">
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
    const params = useParams();
    const { lang } = params;
    const columnNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const columnName = `${columnNames[cIndex]}${rIndex}`;

    if (values && values.length) {
        return (
            <Select 
            className="w-full"
            label={ lang === "es" ? "Seleccionar valor" : "Select value" }
            variant="bordered"
            selectedKeys={value}
            size="sm"
            key={columnName}
            id={columnName} 
            name={columnName}
            onChange={() => {
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
                {
                    values.map(value => (<SelectItem key={value}>{value}</SelectItem>))
                }
            </Select>
        )
    }

    return <Input
            className="w-max"
            variant="bordered" 
            size="sm"
            type="text" 
            key={columnName} 
            id={columnName} 
            name={columnName} 
            value={value} 
            autoComplete="off" 
            onChange={(e) => {
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