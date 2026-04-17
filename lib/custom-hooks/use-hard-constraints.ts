"use client"
import { useState } from "react";

export default function useHardConstraints(initialState: {
    disabledRows: Set<string>,
    disabledColumns: Set<string>,
} = { disabledRows: new Set(), disabledColumns: new Set() }) {
    const [disabledRows, setDisabledRows] = useState(initialState.disabledRows);
    const [disabledColumns, setDisabledColumns] = useState(initialState.disabledColumns);

    const disableRow = (rowId: string) => {
        setDisabledRows(prev => {
            const newSet = prev;
            newSet.add(rowId);
            return newSet;
        });
    }
    const disableColumn = (columnLetter: string) => {
        setDisabledColumns(prev => {
            const newSet = prev;
            newSet.add(columnLetter);
            return newSet;
        });
    }
    const enableRow = (rowId: string) => {
        setDisabledRows(prev => {
            const newSet = prev;
            newSet.delete(rowId);
            return newSet;
        });
    }
    const enableColumn = (columnLetter: string) => {
        setDisabledColumns(prev => {
            const newSet = prev;
            newSet.delete(columnLetter);
            return newSet;
        });
    }
    return {
        disableRow,
        disableColumn,
        enableRow,
        enableColumn,
        disabledRows,
        disabledColumns,
    }
}