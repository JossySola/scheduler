"use client"
import { SetStateAction, useActionState, useState } from "react";
import { generateTableAction } from "../[lang]/table/actions";

export type RowSpecs = {
    disable:boolean,
    count: number,
    enabledValues: Array<string>,
    enabledColumns: Array<string>,
}
export type ColSpecs = {
    numberOfRows: number,
    amountOfValues: Array<string>,
}
export function useTableSpecs () {
    const [ values, setValues ] = useState<Array<string>>([]);
    const [ colSpecs, setColSpecs ] = useState<Array<ColSpecs>>([]);
    const [ rowSpecs, setRowSpecs ] = useState<Array<RowSpecs>>([]);
    return {
        values,
        setValues,
        colSpecs,
        setColSpecs,
        rowSpecs,
        setRowSpecs,
    }
}
export function useTableHandlers (setRowSpecs: React.Dispatch<SetStateAction<Array<RowSpecs>>>, setColSpecs: React.Dispatch<SetStateAction<Array<ColSpecs>>>) {
    const [ columnHeaders, setColumnHeaders ] = useState<Array<string>>([]);
    const [ rowHeaders, setRowHeaders ] = useState<Array<string>>([]);

    const handleAddColumn = (): void => {
        if (rowHeaders && rowHeaders.length === 0) {
            setColSpecs(prev => [...prev, {
                numberOfRows: rowHeaders.length ?? 0,
                amountOfValues: [],
            }])
            return setRowHeaders([""]);
        }
        setColSpecs(prev => [...prev, {
            numberOfRows: rowHeaders.length ?? 0,
            amountOfValues: [],
        }])
        return setColumnHeaders(prev => !prev ? [""] : [...prev, ""] );
    }
    const handleAddRow = (): void => {
        if (!columnHeaders.length) return setColumnHeaders([""]);
        setRowHeaders(prev => !prev ? [""] : [...prev, ""]);
        setRowSpecs(prev => [...prev, {
            disable: false,
            count: columnHeaders && columnHeaders.length ? columnHeaders.length : 0,
            enabledValues: [],
            enabledColumns: [],
        }])
    }
    const handleDeleteColumn = (): void => {
        if (!columnHeaders.length) return;
        if (columnHeaders.length === 1) {
            setColumnHeaders([]);
            setRowHeaders([]);
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

export function useAnthropic () {
    const [ anthropicState, anthropicAction, anthropicPending ] = useActionState(generateTableAction, { rows: [], conflicts: [] });
    return {
        anthropicAction,
        anthropicPending,
        anthropicState,
    }
}