import { useRef, useState } from "react"
import { v4 as uuidv4 } from 'uuid'

export function useHTMLTable() {
    const [ numColumns, setNumColumns ] = useState<number>(0);
    const [ numRows, setNumRows ] = useState<number>(0);
    const [ columns, setColumns ] = useState<Array<React.JSX.Element>>([]);
    const [ rows, setRows ] = useState<Array<React.JSX.Element>>([]);

    const addColumn = (value?: string) => {
        setColumns(prev => {
            return [...prev, <th scope="col" key={uuidv4()}><input type="text" placeholder={value ? value : ''}/></th>]
        })

        if (rows) {

        }

        setNumColumns(prev => prev + 1);
    }
    const addRow = (value?: string) => {
        if (numColumns === 0) {
            return addColumn(value);
        }
        setRows(prev => {
            let elements = [];
            
            for (let i = 0; i < numColumns; i++) {
                if (i === 0) {
                    elements.push(<th key={uuidv4()} scope="row"><input type="text" placeholder={value ? value : ''}/></th>);
                    continue;
                }
                elements.push(<td key={uuidv4()}><input type="text" placeholder={value ? value : ''}/></td>)
            }
            return [
                ...prev,
                <tr key={uuidv4()}>
                    {elements}
                </tr>
            ]
        })
        setNumRows(prev => prev + 1);
    }

    return {columns, rows, addColumn, addRow}
}