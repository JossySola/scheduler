"use client"
import { useCallback, useState } from "react";
import { HeaderType, TableState } from "../definitions";

export default function useRows(
    initialState: TableState = []) {
    const [rows, setRows] = useState<TableState>(initialState);

    const addRow = useCallback(() => {
        setRows(prev => {
            const maxCols = prev[0] ? prev[0].length : 1;
            const newRow = Array.from({ length: maxCols }, (_, colIndex) => 
                colIndex === 0 
                ? ({ value: "", type: "text", isVisible: true } as HeaderType) 
                : ""
            );
            return [...prev, newRow];
        });
    }, []);
    const addCol = useCallback(() => {
        setRows(prev => {
            const maxCols = prev[0] ? prev[0].length : 1;
            const newArray = prev.map((row, index) => {
                if (index === 0) {
                    return row.toSpliced(maxCols, 0, {
                        value: "",
                        type: "text",
                        isVisible: true,
                    });
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
    const editCell = useCallback(({rowIndex, colIndex, value, type, isVisible}: {
        rowIndex: number, colIndex: number, value?: string, type?: "text" | "time" | "date", isVisible?: boolean,
    }) => {
        setRows(prev => prev.map((row, rIdx) => {
            if (rIdx !== rowIndex) return row; // Keep other rows exactly as they are
            
            return row.map((cell, cIdx) => {
                if (cIdx !== colIndex) return cell; // Keep other cells exactly as they are
                
                // If it's a primitive string cell
                if (typeof cell === "string") {
                    return value !== undefined ? value : cell;
                }
                
                // If it's an object cell (HeaderType), return a brand new object copy
                return {
                    ...cell,
                    ...(value !== undefined && { value }),
                    ...(type !== undefined && { type }),
                    ...(isVisible !== undefined && { isVisible }),
                };
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
