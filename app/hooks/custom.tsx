import { useRef, useState } from "react"
import { v4 as uuidv4 } from 'uuid'

export function useTable () {
    const [ numColumns, setNumColumns ] = useState<number>(0);
    const [ numRows, setNumRows ] = useState<number>(0);
    const [ columns, setColumns ] = useState<Array<React.JSX.Element>>([]);
    const [ rows, setRows ] = useState<Array<React.JSX.Element>>([]);
    // Reference to the <thead> targeting columns. Only one element available as there is only one row of columns
    const columnsRef = useRef<HTMLTableRowElement | null>();
    // Reference to each <tr> targeting a row. Array of nodes as there can be multiple rows.
    const rowsRef = useRef<(HTMLElement | null)[]>([]);

    const addColumn = () => {
        // If empty, create row with one cell
        if (numColumns === 0 && numRows === 0) {
            setColumns([
                <thead key={uuidv4()}>
                    <tr 
                        ref={(element) => {
                        columnsRef.current = element;
                    }}>
                        <th scope="col"><input type="text" name={`${numRows}-${numColumns}`}/></th>
                    </tr>
                </thead>
            ])
            setNumColumns(1);
            setNumRows(1);
            return;
        }
        // If not empty, add cell to columnsRef and to each existing row
        if (columnsRef.current) {
            const th = createNewTH();
            columnsRef.current.append(th);

            if (rowsRef.current) {
                rowsRef.current.forEach((element) => {
                    const td = createNewTD();
                    element?.append(td);
                })
            }
            setNumColumns(prev => prev + 1);
        }
    }

    const addRow = () => {
        // If empty, create row with one cell. *The first row will be considered as a row of columns*
        if (numColumns === 0 && numRows === 0) {
            if (numColumns === 0 && numRows === 0) {
                setColumns([
                    <thead key={uuidv4()}>
                        <tr 
                            ref={(element) => {
                            columnsRef.current = element;
                        }}>
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
        setRows((prev) => {
            const extraColumns = () => {
                let elements = [];
                for(let i = 0; i < numColumns - 1; i++) {
                    elements.push(<td><input type="text" name={`${numRows}-${numColumns}`} /></td>);
                }
                return elements;
            }
            return [
                ...prev,
                <tr 
                    ref={(element) => {
                        rowsRef.current.push(element);
                    }} 
                >
                    <th scope="row"><input type="text" name={`${numRows}-${numColumns}`} /></th>
                    {
                        extraColumns()
                    }
                </tr>
            ]
        })
        setNumRows(prev => prev + 1);
    }

    const deleteColumn = (index: number) => {

    }

    const deleteRow = (index: number) => {

    }

    const createNewTH = () => {
        const th = document.createElement("th");
        const input = document.createElement("input");

        th.setAttribute("scope", "col");
        input.setAttribute("type", "text");
        input.setAttribute("name", `${numRows}-${numColumns}`);

        th.append(input);
        return th;
    }
    const createNewTD = () => {
        const td = document.createElement("td");
        const input = document.createElement("input");

        input.setAttribute("type", "text");
        input.setAttribute("name", `${numRows}-${numColumns}`);

        td.append(input);
        return td;
    }
    return {columns, rows, addColumn, addRow}
}