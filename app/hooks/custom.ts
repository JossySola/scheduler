"use client"
import { SetStateAction, useEffect, useState } from "react";

export function useRows (rows?: string[][] | undefined, storedValues?: string[] | undefined, storedSpecs?: number[] | undefined): [
    string[][],
    React.Dispatch<SetStateAction<string[][]>>, 
    number[],
    React.Dispatch<SetStateAction<number[]>>,
    () => void,
    () => void,
    () => void,
    () => void,
    string[],
    React.Dispatch<SetStateAction<string[]>>,
    
] {
    const [ localRows, setLocalRows ] = useState<Array<Array<string>>>([]);
    const [ values, setValues ] = useState<Array<string>>([]);
    const [ colSpecs, setColSpecs ] = useState<Array<number>>([]);

    useEffect(() => {
        if (rows) setLocalRows(rows);
    }, []);

    useEffect(() => {
        if (storedValues) {
            setValues(storedValues);
        }
    }, []);

    useEffect(() => {
        if (storedSpecs) {
            setColSpecs(storedSpecs);
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
            if (prev[0] && prev[0].length === 1) {
                return [];
            };
            return prev.map(row => row.slice(0, -1));
        });
    };
    const handleDeleteRow = () => {
        setLocalRows(prev => {
            if(!prev.length) prev;
            if (prev.length && prev.length === 1) {
                return [];
            };
            return prev.slice(0, -1);
        })
    };

    return [ 
        localRows, 
        setLocalRows, 
        colSpecs,
        setColSpecs,
        handleAddColumn, 
        handleDeleteColumn, 
        handleAddRow, 
        handleDeleteRow,
        values,
        setValues,
    ]
}