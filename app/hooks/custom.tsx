import { useState } from "react";

export function useCreate () {
    const [ numColumns, setNumColumns ] = useState<number>(0);
    const [ numRows, setNumRows ] = useState<number>(0);
    const [ columns, setColumns ] = useState<Array<Array<React.JSX.Element>>>([]);
    const [ rows, setRows ] = useState<Array<Array<React.JSX.Element>>>([]);

    const addColumn = () => {

    }

    const addRow = () => {
        
    }
    
}