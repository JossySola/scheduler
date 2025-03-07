"use client"
import { SetStateAction, useEffect, useState } from "react";

export type Specs = {
    disable:boolean,
    count: number,
    enabledValues: Array<string>,
    enabledColumns: Array<string>,
}
export function useRows (rows?: string[][], storedValues?: string[], storedSpecs?: Specs[], storedColSpecs?: number[]): [
    // map
    string[][],
    // headers
    string[],
    React.Dispatch<SetStateAction<string[]>>,
    string[],
    React.Dispatch<SetStateAction<string[]>>,
    // specs
    Specs[],
    number[],
    // values
    string[],
    React.Dispatch<SetStateAction<string[]>>,
    // handlers
    () => void,
    () => void,
    () => void,
    () => void,
] {
    const [ values, setValues ] = useState<Array<string>>([]);
    const [ specs, setSpecs ] = useState<Array<Specs>>([]);
    const [ colSpecs, setColSpecs ] = useState<Array<number>>([]);
    const [ colHeaders, setColHeaders ] = useState<Array<string>>([]);
    const [ rowHeaders, setRowsHeaders ] = useState<Array<string>>([]);

    const [ map, setMap ] = useState<Array<Array<string>>>([]);

    useEffect(() => {
        if (rows) {
            setMap(() => rows.map(row => {
                return row.map(() => {
                    return "";
                })
            }))
        }
    }, []);

    useEffect(() => {
        if (rows) {
            setColHeaders(rows[0]);
            setRowsHeaders(rows.map(header => header[0]));
        };
    }, []);
    useEffect(() => {
        setColHeaders(map[0]);
        setRowsHeaders(map && map.map(header => header[0]));
    }, [map])

    useEffect(() => {
        if (storedValues) setValues(storedValues);
    }, []);

    useEffect(() => {
        if (storedSpecs) setSpecs(specs);
    })

    useEffect(() => {
        if (storedColSpecs) setColSpecs(storedColSpecs);
    }, []);
    
    const handleAddColumn = () => {
        if (!map.length) {
            return setMap([[""]]);
        }
        setMap(() => 
            map && map.map(row => [...row, ""])
        );
    };
    const handleAddRow = () => {
        if (!map.length) {
            return setMap([[""]]);
        }
        setMap(prev => 
            [...prev, 
            map[0] && map[0].length ? 
            map[0].map(() => {
                return '';
            }) : ['']]
        );
    };
    const handleDeleteColumn = () => {
        setMap(prev => {
            if (!prev.length) prev;
            if (prev[0] && prev[0].length === 1) {
                return [];
            };
            return prev.map(row => row.slice(0, -1));
        });
    };
    const handleDeleteRow = () => {
        setMap(prev => {
            if(!prev.length) prev;
            if (prev.length && prev.length === 1) {
                return [];
            };
            return prev.slice(0, -1);
        })
    };
    return [ 
        map,
        colHeaders,
        setColHeaders,
        rowHeaders,
        setRowsHeaders,
        specs,
        colSpecs,
        values,
        setValues,
        handleAddColumn, 
        handleDeleteColumn, 
        handleAddRow, 
        handleDeleteRow,
    ]
}