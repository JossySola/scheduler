"use client"
import { SetStateAction, useEffect, useState } from "react";

export function useRows (rows?: string[][] | undefined): [
    string[][],
    React.Dispatch<SetStateAction<string[][]>>, 
    () => void,
    () => never[] | undefined,
    () => void,
    () => never[] | undefined,
] {
    const [ localRows, setLocalRows ] = useState<Array<Array<string>>>([]);
    
    useEffect(() => {
        if (rows) setLocalRows(rows);
    }, []);
    
    const handleAddColumn = () => {
        if (!localRows.length) {
            return setLocalRows([[""]]);
        }
        setLocalRows(() => 
            localRows && localRows.map(row => [...row, ""])
        );
    };
    const handleAddRow = () => {
        if (!localRows.length) {
            return setLocalRows([[""]]);
        }
        setLocalRows(prev => 
            [...prev, 
            localRows[0] && localRows[0].length ? 
            localRows[0].map(() => {
                return '';
            }) : ['']]
        );
    };
    const handleDeleteColumn = () => {
        if (!localRows.length) {
            return [];
        }
        setLocalRows(localRows && localRows.map(row => {
            const temp = [...row];
            temp.pop();
            return temp;
        }));
    };
    const handleDeleteRow = () => {
        if (!localRows.length) {
            return [];
        }
        setLocalRows(localRows.filter((_, index) => index !== localRows.length - 1));
    };

    return [ 
        localRows, 
        setLocalRows, 
        handleAddColumn, 
        handleDeleteColumn, 
        handleAddRow, 
        handleDeleteRow,
    ]
}

export function useDynamicTableData (rows: Array<Array<string>>, passedValues?: Array<string>, passedCriteria?: Array<string>): [ values: string[], 
    setValues: React.Dispatch<SetStateAction<string[]>>,
    columns: string[],
    setColumns: React.Dispatch<SetStateAction<string[]>>,
    rowHeaders: string[],
    ] {
    const [ values, setValues ] = useState<Array<string>>([]);
    const [ columns, setColumns ] = useState<Array<string>>([]);
    const [ rowHeaders, setRowHeaders ] = useState<Array<string>>([]);

    useEffect(() => {
        if (passedValues) {
            setValues(passedValues);
        }
        if (passedCriteria) {
            setColumns(passedCriteria);
        }
    }, []);

    useEffect(() => {
        setRowHeaders(rows.map(row => row[0]));
        setColumns(rows[0]);
    }, [rows])

    return [
        values,
        setValues,
        columns,
        setColumns,
        rowHeaders,
    ]
}