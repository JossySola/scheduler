import { useRef, useState } from "react"
import { v4 as uuidv4 } from 'uuid'

export function useTable () {
    const [ numColumns, setNumColumns ] = useState<number>(0);
    const [ numRows, setNumRows ] = useState<number>(0);
    const [ columns, setColumns ] = useState<Array<React.JSX.Element>>([]);
    const [ rows, setRows ] = useState<Array<React.JSX.Element>>([]);
    // Reference to the <thead> targeting columns. Only one element available as there is only one row of columns
    const columnsRef = useRef<HTMLTableSectionElement | null>();
    // Reference to each <th> targeting a row. Array of nodes as there can be multiple rows.
    const rowsRef = useRef<(HTMLTableSectionElement | null)[]>([]);

    const addColumn = () => {
        // If empty, create row with one cell
        if (numColumns === 0 && numRows === 0) {
            setColumns([
                <thead 
                ref={(element) => {
                    columnsRef.current = element;
                }}
                key={uuidv4()}>
                    <tr>
                        <th scope="col"><input type="text" name={`${numRows}-${numColumns}`}/></th>
                    </tr>
                </thead>
            ])
            setNumColumns(1);
            setNumRows(1);
            return;
        }
        // If not empty, add cell to columnRef and to each existing row

    }

    const addRow = () => {
        // If empty, create row with one cell. *The first row will be considered as a row of columns*
        if (numColumns === 0 && numRows === 0) {
            if (numColumns === 0 && numRows === 0) {
                setColumns([
                    <thead 
                    ref={(element) => {
                        columnsRef.current = element;
                    }}
                    key={uuidv4()}>
                        <tr>
                            <th scope="col"><input type="text" name={`${numRows}-${numColumns}`}/></th>
                        </tr>
                    </thead>
                ])
                setNumColumns(1);
                setNumRows(1);
                return;
            }
        }
        // If not empty, create row with X number of columns/cells

    }

    const deleteColumn = (index: number) => {

    }

    const deleteRow = (index: number) => {

    }
    return {columns, rows, addColumn, addRow}
}