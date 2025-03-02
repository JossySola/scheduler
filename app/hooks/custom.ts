"use client"
import { SetStateAction, useEffect, useState } from "react";

export function useRows (rows?: string[][] | undefined, passedValues?: string[] | undefined): [
    string[][],
    React.Dispatch<SetStateAction<string[][]>>, 
    () => void,
    () => void,
    () => void,
    () => void,
    string[],
    React.Dispatch<SetStateAction<string[]>>,
] {
    const [ localRows, setLocalRows ] = useState<Array<Array<string>>>([]);
    const [ values, setValues ] = useState<Array<string>>([]);

    useEffect(() => {
        if (rows) setLocalRows(rows);
    }, []);

    useEffect(() => {
        if (passedValues) {
            setValues(passedValues);
        }
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
        setLocalRows(prev => {
            if (!prev.length) prev;
            return prev.map(row => row.slice(0, -1));
        });
    };
    const handleDeleteRow = () => {
        setLocalRows(prev => {
            if(!prev.length) prev;
            return prev.slice(0, -1);
        })
    };

    return [ 
        localRows, 
        setLocalRows, 
        handleAddColumn, 
        handleDeleteColumn, 
        handleAddRow, 
        handleDeleteRow,
        values,
        setValues
    ]
}