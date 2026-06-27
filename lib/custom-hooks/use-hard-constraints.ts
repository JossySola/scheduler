"use client"
import { useCallback, useState } from "react";

export default function useHardConstraints(initialState: {
    disabledRows: Set<string>,
    disabledColumns: Set<string>,
} = { disabledRows: new Set(), disabledColumns: new Set() }) {
    const [disabledRows, setDisabledRows] = useState(initialState.disabledRows);
    const [disabledColumns, setDisabledColumns] = useState(initialState.disabledColumns);

    const disableRow = useCallback((value: string) => {
        setDisabledRows(prev => {
            const newSet = new Set(Array.from(prev));
            newSet.add(value);
            return newSet;
        });
    }, []);
    const disableColumn = useCallback((value: string) => {
        setDisabledColumns(prev => {
            const newSet = new Set(Array.from(prev));
            newSet.add(value);
            return newSet;
        });
    }, []);
    const enableRow = useCallback((value: string) => {
        setDisabledRows(prev => {
            const newSet = new Set(Array.from(prev));
            newSet.delete(value);
            return newSet;
        });
    }, []);
    const enableColumn = useCallback((value: string) => {
        setDisabledColumns(prev => {
            const newSet = new Set(Array.from(prev));
            newSet.delete(value);
            return newSet;
        });
    }, []);
    const replaceRowsList = useCallback((selection: Set<string>) => {
        setDisabledRows(selection);
    }, []);
    const replaceColsList = useCallback((selection: Set<string>) => {
        setDisabledColumns(selection);
    }, []);
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
