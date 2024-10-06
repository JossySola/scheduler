import { useState } from "react";

export function useCreate () {
    const [ numColumns, setNumColumns ] = useState<number>(0);
    const [ numRows, setNumRows ] = useState<number>(0);
    const [ columns, setColumns ] = useState<Array<Array<React.JSX.Element>>>([]);
    const [ rows, setRows ] = useState<Array<Array<React.JSX.Element>>>([]);

    const addColumn = () => {
        // If no cell, create row with one cell
        // If one row, add column to existing row
        // If 1+ rows, add columns for each existing row
    }

    const addRow = () => {
        // If no cell, create row with one cell
        // If one row, create another row below
        // If 1+ columns, create row with X number of columns
    }
    
}