"use client"
import { useCallback, useState } from "react";

export default function useStructuralConstraints(initialState: {
    columnsSpecificity: Map<string, Set<string>>,
    rowsSpecificity: Map<string, Set<string>>,
} = { columnsSpecificity: new Map(), rowsSpecificity: new Map() }) {
    // <In X column> fill Y rows
    const [columnsSpecificity, setColumnsSpecificity] = useState<Map<string, Set<string>>>(initialState.columnsSpecificity);
    // <In Y row> fill X columns
    const [rowsSpecificity, setRowsSpecificity] = useState<Map<string, Set<string>>>(initialState.rowsSpecificity);

    const addColumnSpec = useCallback((column: string, newRow: string) => {
        if (columnsSpecificity.has(column)) {
            setColumnsSpecificity(prev => {
                const newState = new Map(Array.from(prev));
                const currentSet = newState.get(column)!;
                currentSet.add(newRow);
                newState.set(column, currentSet);
                return newState;
            });
        } else {
            setColumnsSpecificity(prev => {
                const newState = new Map(Array.from(prev));
                const newSet: Set<string> = new Set();
                newSet.add(newRow);
                newState.set(column, newSet);
                return newState;
            });
        }
    }, []);
    const addRowSpec = useCallback((row: string, newCol: string) => {
        if (rowsSpecificity.has(row)) {
            setRowsSpecificity(prev => {
                const newState = new Map(Array.from(prev));
                const currentSet = newState.get(row)!;
                currentSet.add(newCol);
                newState.set(row, currentSet);
                return newState;
            });
        } else {
            setRowsSpecificity(prev => {
                const newState = new Map(Array.from(prev));
                const newSet: Set<string> = new Set();
                newSet.add(newCol);
                newState.set(row, newSet);
                return newState;
            });
        }
    }, []);
    const deleteColumnSpec = useCallback((column: string, rowToDelete: string) => {
        setColumnsSpecificity(prev => {
            const newState = new Map(Array.from(prev));
            if (newState.has(column)) {
                const currentSet = newState.get(column)!;
                currentSet.delete(rowToDelete);
                newState.set(column, currentSet);
            }
            return newState;
        });
    }, []);
    const deleteRowSpec = useCallback((row: string, colToDelete: string) => {
        setRowsSpecificity(prev => {
            const newState = new Map(Array.from(prev));
            if (newState.has(row)) {
                const currentSet = newState.get(row)!;
                currentSet.delete(colToDelete);
                newState.set(row, currentSet);
            }
            return newState;
        });
    }, []);

    return {
        addColumnSpec,
        addRowSpec,
        deleteColumnSpec,
        deleteRowSpec,
        columnsSpecificity,
        rowsSpecificity,
    }
}