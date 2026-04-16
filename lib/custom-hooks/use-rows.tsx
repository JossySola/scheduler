"use client"
import { useMemo, useState } from "react";
import { generateColumnName } from "../utils";
import { RowsState } from "../definitions";

export default function useRows(
    initialState: RowsState = new Map()) {
    const [rows, setRows] = useState<RowsState>(initialState);
    // Check how many columns will be added in a new row
    const maxCols = rows.values().find(value => value !== undefined)?.size ?? 1;
    const columnNames = useMemo(() => {
        return Array.from({length: maxCols}, (_, i) => generateColumnName(i));
    }, [maxCols]);
    
    const addRow = (id: string) => {
        const newMap = new Map(
            columnNames.slice(0, maxCols).map(name => [name as string, ""])
        );
        setRows(prev => {
            const previous = prev;
            previous.set(id, newMap);
            return previous;
        });
    }
    const addCol = () => {
        setRows(prev => {
            const previous = prev;
            previous.forEach(row => row.set(generateColumnName(maxCols), ""));
            return previous;
        });
    }
    const deleteRow = (id: string) => {
        setRows(prev => {
            const previous = prev;
            previous.delete(id);
            return previous;
        });
    }
    const editRow = (rowId: string, colLetter: string, value: string) => {
        setRows(prev => {
            const newRow = prev.get(rowId);
            if (newRow) {
                newRow?.set(colLetter, value);
                const newRows = prev;
                newRows.set(rowId, newRow);
                return newRows;
            }
            return prev;
        });
    }
    return {
        rows,
        addRow,
        addCol,
        deleteRow,
        editRow,
    }
}