"use client"
import { useCallback, useState } from "react";
import { TableState } from "../definitions";

export default function useRows(
    initialState: TableState = []) {
    const [rows, setRows] = useState<TableState>(initialState);

    const addRow = useCallback(() => {
        setRows(prev => {
            const maxCols = prev[0] ? prev[0].length : 1;
            const newRow = Array.from({ length: maxCols }, () => " ");
            return [...prev, newRow];
        });
    }, []);
    const addCol = useCallback(() => {
        setRows(prev => {
            const maxCols = prev[0] ? prev[0].length : 1;
            const newArray = prev.map((row, index) => {
                if (index === 0) {
                    return row.toSpliced(maxCols, 0, "");
                }
                return row.toSpliced(maxCols, 0, "");
            });
            return newArray;
        });
    }, []);
    const deleteRow = useCallback((index?: number) => {
        setRows(prev => {
            if (index !== undefined) {
                return prev.toSpliced(index, 1);
            }
            return prev.slice(0, -1);
        });
    }, []);
    const deleteColumn = useCallback((index?: number) => {
        setRows(prev => {
            if (index !== undefined) {
                return prev.map(row => {
                    return row.toSpliced(index, 1);
                });
            }
            if (prev && prev[0] && prev[0].length === 1) {
                return [];
            }
            return prev.map(row => {
                return row.slice(0, -1);
            });
        });
    }, []);
    const editCell = useCallback(({rowIndex, colIndex, value}: {
        rowIndex: number, colIndex: number, value: string,
    }) => {
        setRows(prev => prev.map((row, rIdx) => {
            if (rIdx !== rowIndex) return row; // Keep other rows exactly as they are
            
            return row.map((cell, cIdx) => {
                if (cIdx !== colIndex) return cell; // Keep other cells exactly as they are
                return value;
            });
        }));
    }, []);

    return {
        rows,
        addRow,
        addCol,
        deleteRow,
        deleteColumn,
        editCell,
    }
}
