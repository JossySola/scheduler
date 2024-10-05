'use client'
import { useState } from "react"

export default function NewDynamicTable(): React.JSX.Element {
    const [numColumns, setNumColumns] = useState<number>(0);
    const [columns, setColumns] = useState<Array<React.JSX.Element>>([]);
    const [numRows, setNumRows] = useState<number>(0);
    const [rows, setRows] = useState<Array<React.JSX.Element>>([]);
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const [inputs, setInputs] = useState<Array<React.JSX.Element>>([]);
    const [head, setHead] = useState<Array<React.JSX.Element>>([]);
    
    const handleAddColumn = () => {
        if (numColumns === 0) {
            setNumColumns(prev => prev + 1); 
            setColumns([<th><input type="input" name={`${letters[numColumns]}${numColumns}`} id={`${letters[numColumns]}${numColumns}`}/></th>]);
            return;
        }
        setNumColumns(prev => prev + 1);
        setColumns(prev => [...prev, <th><input type="input" name={`${letters[numColumns]}${numColumns}`} id={`${letters[numColumns]}${numColumns}`}/></th>])
    }

    return (
        <>
            <form>
                <input type="text" name="name" id="tname" placeholder="Untitled table" defaultValue="Untitled table"/>
                <table>
                    <thead>
                        <tr id="headers">
                            {columns}
                        </tr>
                    </thead>
                    <tbody>
                        {inputs}
                    </tbody>
                </table>
            </form>
            <button type="button" onClick={() => handleAddColumn()}>Add Column</button>
        </>
    )
}

