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

    const setColumnSpec = useCallback((column: string, newArray: Array<string>) => {
        const arrayToSet = new Set(newArray);
        setColumnsSpecificity(prev => {
            const newState = new Map(Array.from(prev));
            newState.set(column, arrayToSet);
            return newState;
        });
    }, []);
    const setRowSpec = useCallback((row: string, newArray: Array<string>) => {
        const arrayToSet = new Set(newArray);
        setRowsSpecificity(prev => {
            const newState = new Map(Array.from(prev));
            newState.set(row, arrayToSet);
            return newState;
        });
    }, []);
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
    const deleteRowInColumnSpec = useCallback((column: string, rowToDelete: string) => {
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
    const deleteColumnInRowSpec = useCallback((row: string, colToDelete: string) => {
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
    const deleteRowFromStructuralMap = useCallback((row?: string) => {
        setRowsSpecificity(prev => {
            let newState = new Map(Array.from(prev));
            if (row && newState.has(row)) {
                newState.delete(row);
            } else {
                const mapToArray = Array.from(prev).toSpliced(-1, 1);
                return new Map(mapToArray);
            }
            return newState;
        });
    }, []);
    const deleteColumnFromStructuralMap = useCallback((column?: string) => {
        setColumnsSpecificity(prev => {
            const newState = new Map(Array.from(prev));
            if (column && newState.has(column)) {
                newState.delete(column);
            } else {
                const mapToArray = Array.from(prev).toSpliced(-1, 1);
                return new Map(mapToArray);
            }
            return newState;
        });
    }, []);

    return {
        setColumnSpec,
        setRowSpec,
        addColumnSpec,
        addRowSpec,
        deleteRowInColumnSpec,
        deleteColumnInRowSpec,
        deleteRowFromStructuralMap,
        deleteColumnFromStructuralMap,
        columnsSpecificity,
        rowsSpecificity,
    }
}