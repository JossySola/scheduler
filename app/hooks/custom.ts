"use client"
import { SetStateAction, useState } from "react";

export type Specs = {
    disable:boolean,
    count: number,
    enabledValues: Array<string>,
    enabledColumns: Array<string>,
}

export function useTableSpecs () {
    const [ values, setValues ] = useState<Array<string>>([]);
    const [ colSpecs, setColSpecs ] = useState<Array<number>>([]);
    const [ specs, setSpecs ] = useState<Array<Specs>>([]);
    return {
        values,
        setValues,
        colSpecs,
        setColSpecs,
        specs,
        setSpecs,
    }
}
export function useTableHandlers (setSpecs: React.Dispatch<SetStateAction<Array<Specs>>>) {
    const [ columnHeaders, setColumnHeaders ] = useState<Array<string>>([]);
    const [ rowHeaders, setRowHeaders ] = useState<Array<string>>([]);

    const handleAddColumn = (): void => {
        setColumnHeaders(prev => prev ? [...prev, ""] : [""]);
    }
    const handleAddRow = (): void => {
        if (!rowHeaders.length) setColumnHeaders([""]);
        setRowHeaders(prev => [...prev, ""]);
        setSpecs(prev => [...prev, {
            disable: false,
            count: columnHeaders && columnHeaders.length,
            enabledValues: [],
            enabledColumns: [],
        }])
    }
    const handleDeleteColumn = (): void => {
        if (!columnHeaders.length) return;
        if (columnHeaders.length === 1) {
            setColumnHeaders([])
            setRowHeaders([])
        };
        return setColumnHeaders(prev => prev.slice(0, -1));
    }
    const handleDeleteRow = (): void => {
        if (!rowHeaders.length) return;
        if (rowHeaders.length === 1) {
            setRowHeaders([])
            setColumnHeaders([])
        };
        return setRowHeaders(prev => prev.slice(0, -1));
    }
    return {
        setColumnHeaders,
        setRowHeaders,
        columnHeaders,
        rowHeaders,
        handleAddColumn,
        handleAddRow,
        handleDeleteColumn,
        handleDeleteRow,
    }
}