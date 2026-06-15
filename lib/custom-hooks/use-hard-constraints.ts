"use client"
import { useState } from "react";

export default function useHardConstraints(initialState: {
    disabledRows: Set<string>,
    disabledColumns: Set<string>,
} = { disabledRows: new Set(), disabledColumns: new Set() }) {
    const [disabledRows, setDisabledRows] = useState(initialState.disabledRows);
    const [disabledColumns, setDisabledColumns] = useState(initialState.disabledColumns);

    const disableRow = (value: string) => {
        setDisabledRows(prev => {
            const newSet = new Set(Array.from(prev));
            newSet.add(value);
            return newSet;
        });
    }
    const disableColumn = (value: string) => {
        setDisabledColumns(prev => {
            const newSet = new Set(Array.from(prev));
            newSet.add(value);
            return newSet;
        });
    }
    const enableRow = (value: string) => {
        setDisabledRows(prev => {
            const newSet = new Set(Array.from(prev));
            newSet.delete(value);
            return newSet;
        });
    }
    const enableColumn = (value: string) => {
        setDisabledColumns(prev => {
            const newSet = new Set(Array.from(prev));
            newSet.delete(value);
            return newSet;
        });
    }
    const replaceRowsList = (selection: Set<string>) => {
        setDisabledRows(selection);
    }
    const replaceColsList = (selection: Set<string>) => {
        setDisabledColumns(selection);
    }
    return {
        disableRow,
        disableColumn,
        enableRow,
        enableColumn,
        disabledRows,
        disabledColumns,
        replaceRowsList,
        replaceColsList,
    }
}