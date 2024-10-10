import { useState } from "react"
import { v4 as uuidv4 } from 'uuid'

export function useHTMLTable() {
    const [ numColumns, setNumColumns ] = useState<number>(0);
    const [ numRows, setNumRows ] = useState<number>(0);
    const [ columns, setColumns ] = useState<Array<React.JSX.Element>>([]);
    const [ rows, setRows ] = useState<Array<Array<React.JSX.Element>>>([]);

    const addColumn = (value?: string) => {
        setColumns(prev => {
            return [...prev, <th scope="col" key={uuidv4()}><input type="text" placeholder={value ? value : ''}/></th>]
        })
        if (rows) {
            setRows(prev => {
                return prev.map(row => [
                    ...row,
                    <td key={uuidv4()}><input type="text" placeholder={value ? value : ''}/></td>
                ])
            })
        }
        setNumColumns(prev => prev + 1);
    }

    const addRow = (value?: string) => {
        if (numColumns === 0) {
            setNumRows(prev => prev + 1);
            return addColumn(value);
        }
        setRows(prev => {
            return [
                ...prev,
                columns.map((el, index) => {
                    if (index === 0) {
                        return <th key={uuidv4()} scope="row"><input type="text" placeholder={value ? value : ''}/></th>
                    }
                    return <td key={uuidv4()}><input type="text" placeholder={value ? value : ''}/></td>
                })
            ]
        })
        setNumRows(prev => prev + 1);
    }

    const popColumn = () => {
        setColumns(prev => {
            return prev.filter((col, index) => {
                const final = numColumns - 1;
                if (index !== final) {
                    return col;
                }
            })
        })
        setRows(prev => {
            return prev.map((prevRows) => {
                return prevRows.filter((col, index) => {
                    const final = numColumns - 1;
                    if (index !== final) {
                        return col;
                    }
                })
            })
        })
        setNumColumns(prev => prev - 1);
    }

    const popRow = () => {
        setRows(prev => {
            return prev.filter((row, index) => {
                const final = numRows - 1;
                if (index !== final) {
                    return row;
                }
            })
        })
        setNumRows(prev => prev - 1);
    }

    return {
        columns, 
        rows, 
        numColumns,
        numRows,
        addColumn, 
        addRow,
        popColumn,
        popRow,
    }
}