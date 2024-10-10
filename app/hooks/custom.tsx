import { useState } from "react"
import { v4 as uuidv4 } from 'uuid'

export function useHTMLTable() {
    const [ numColumns, setNumColumns ] = useState<number>(0);
    const [ numRows, setNumRows ] = useState<number>(0);
    const [ columns, setColumns ] = useState<Array<React.JSX.Element>>([]);
    const [ rows, setRows ] = useState<Array<Array<React.JSX.Element>>>([]);

    const addColumn = (value?: string) => {
        // Add a <th> element to the Columns array
        setColumns(prev => {
            return [...prev, <th scope="col" key={uuidv4()}><input type="text" placeholder={value ? value : ''}/></th>]
        })
        // If there are rows, add an input field to each row
        if (numRows) {
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
        // If there are no columns, create a column as the start of the table 
        // instead of a row
        if (numColumns === 0) {
            return addColumn(value);
        }
        setRows(prev => {
            // Mapping the "columns" array, for each column, add an input field
            // in the row. If there are 3 columns, each row must have 3 input
            // fields.
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
        // Avoid accidental negative numbers
        if (numColumns === 0) {
            return;
        }
        setColumns(prev => {
            // There could be one column left with multiple rows, so removing
            // the last column would remove all the rows with it.
            // This condition sets the number of rows to 0 once we've reached
            // the last column
            if (prev.length === 1) {
                setNumRows(0)
            }
            // Filters out the last item in the column array
            return prev.filter((col, index) => {
                const finalItem = numColumns - 1;
                // If the current index is NOT the final index,
                // keep the item.
                if (index !== finalItem) {
                    return col;
                }
            })
        })
        if (numColumns > 1) {
            // If there is more than 1 column
            setRows(prev => {
                // Iterate through the array of rows
                return prev.map((prevRows) => {
                    // Iterate through each array element inside the array of rows
                    // Remember this hook is an Array of arrays [[], [], [], ...]
                    return prevRows.filter((col, index) => {
                        const finalItem = numColumns - 1;
                        // If the current index is NOT the final index,
                        // keep the item.
                        if (index !== finalItem) {
                            return col;
                        }
                    })
                })
            })
        } else {
            // If there are less than 1 column, empty the Array of rows
            setRows([]);
        }
        setNumColumns(prev => prev - 1);
    }

    const popRow = () => {
        // Avoid accidental negative numbers
        if (numRows === 0) {
            return;
        }
        // Filters out the last item in the array of rows
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