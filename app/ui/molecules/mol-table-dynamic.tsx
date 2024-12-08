import React, { Dispatch, SetStateAction, useCallback } from 'react';

const DynamicTable = React.memo(({ rows, columns, setRows }: {
    rows: Array<Array<{id: string, value: string}>>,
    columns: Array<{id: string, value: string}>,
    setRows: Dispatch<SetStateAction<{id: string, value: string}[][]>>
}) => {

    const handleInputChange = useCallback((rowIndex: number, colIndex: number, newValue: string) => {
        setRows(prev => {
            const copy = [...prev];
            copy[rowIndex] = [...copy[rowIndex]];
            copy[rowIndex][colIndex] = {
                ...copy[rowIndex][colIndex],
                value: newValue,
            };
            return copy;
        });
    }, [setRows]);

    return (
        <table className='text-black'>
            <thead>
                <tr>
                    {
                    columns && columns.map((column, index) => {
                        return <th scope="col" key={column.id}>
                                    <input 
                                        type='text' 
                                        id={column.id} 
                                        name={column.id} 
                                        value={column.value} 
                                        onChange={(event) => {
                                            handleInputChange(0, index, event.target.value);
                                        }}>
                                    </input>
                                </th>
                        })
                    }
                </tr>
            </thead>
            <tbody>
                    {
                    rows && rows.map((row, rowIndex) => {
                        return <tr key={rowIndex}>
                            {
                                row.map((cell, colIndex) => {
                                    if (colIndex === 0) {
                                        return <th key={`${rowIndex}-${colIndex}`}>
                                            <input 
                                                type='text' 
                                                id={cell.id} 
                                                name={cell.id} 
                                                value={cell.value} 
                                                onChange={(event) => {
                                                    handleInputChange(rowIndex+1, colIndex, event.target.value);
                                                }}>
                                            </input>
                                        </th>
                                    }
                                    return <td key={`${rowIndex}-${colIndex}`}>
                                        <input 
                                            type='text' 
                                            id={cell.id} 
                                            name={cell.id} 
                                            value={cell.value} 
                                            onChange={(event) => {
                                                handleInputChange(rowIndex+1, colIndex, event.target.value);
                                            }}>
                                        </input>
                                    </td>
                                })
                            }
                        </tr>
                    })
                    }
            </tbody>
        </table>
    )
})

export default DynamicTable;