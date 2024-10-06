import { useState } from "react";

export function useCreateTable () {
    const [ numColumns, setNumColumns ] = useState<number>(0);
    const [ numRows, setNumRows ] = useState<number>(0);
    const [ columns, setColumns ] = useState<Array<Array<React.JSX.Element>>>([]);
    const [ rows, setRows ] = useState<Array<Array<React.JSX.Element>>>([]);

    const addColumn = () => {
        // If empty, create row with one cell
        if (numColumns === 0 && numRows === 0) {
            setRows([
                [
                    <thead>
                        <tr>
                            <th scope="col"><input type="text" name={`${numRows}-${numColumns}`}/></th>
                        </tr>
                    </thead>
                ]
            ])
            setNumColumns(1);
            setNumRows(1);
            return;
        }
        // If not empty, add column to each existing row

    }

    const addRow = () => {
        // If empty, create row with one cell
        if (numColumns === 0 && numRows === 0) {
            setRows([
                [
                    <thead>
                        <tr>
                            <th scope="col"><input type="text" name={`${numRows}-${numColumns}`}/></th>
                        </tr>
                    </thead>
                ]
            ])
            setNumColumns(1);
            setNumRows(1);
            return;
        }
        // If not empty, create row with X number of columns

    }

    const deleteColumn = (index: number) => {

    }

    const deleteRow = (index: number) => {

    }
    return {rows, addColumn, addRow}
}