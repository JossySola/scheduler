"use client"
import { useState } from "react";
import { generateColumnName } from "../utils";
import { HeaderType, TableState } from "../definitions";

export default function useRows(
    initialState: TableState = []) {
    const [rows, setRows] = useState<TableState>(initialState);

    const addRow = () => {
        const maxCols = rows[0] ? rows[0].length : 1;
        setRows(prev => {
            if (prev.length === 0) {
                const newRow = new Array(maxCols).fill({
                    value: "",
                    type: "text",
                    isVisible: true,
                });
                return [...prev, newRow];
            }
            const newRow = new Array(maxCols);
            newRow.fill({
                value: "",
                type: "text",
                isVisible: true,
            }, 0, 1);
            newRow.fill("", 1, maxCols - 1);
            return [...prev, newRow];
        });
    }
    const addCol = () => {
        const maxCols = rows[0] ? rows[0].length : 1;
        setRows(prev => {
            const newArray = prev.map((row, index) => {
                if (index === 0) {
                    return row.toSpliced(maxCols - 1, 0, {
                        value: "",
                        type: "text",
                        isVisible: true,
                    });
                }
                return row.toSpliced(maxCols - 1, 0, "");
            });
            return newArray;
        });
    }
    const deleteRow = (index?: number) => {
        setRows(prev => {
            if (index) {
                return prev.toSpliced(index, 1);
            }
            const newArray = prev;
            newArray.pop();
            return newArray;
        });
    }
    const deleteColumn = (index?: number) => {
        setRows(prev => {
            if (index) {
                return prev.map((row, _) => {
                    return row.toSpliced(index, 1);
                });
            }
            return prev.map((row, _) => {
                row.pop();
                return row;
            });
        });
    }
    const editCell = ({rowIndex, colIndex, value, type, isVisible}: {
        rowIndex: number,
        colIndex: number,
        value?: string,
        type?: "text" | "time" | "date",
        isVisible?: boolean,
    }) => {
        setRows(prev => {
            const newRows = [...prev];
            if (value) {
                const newCell = newRows[rowIndex][colIndex];
                if (typeof newCell !== "string") {
                    (newCell as HeaderType).value = value;
                } else {
                    newCell = value;
                }
                return newRows;
            } 
            if (type) {
                const newCell = newRows[rowIndex][colIndex];
                if (typeof newCell !== "string") {
                    (newCell as HeaderType).type = type;
                }
                return newRows;
            }
            if (isVisible !== undefined) {
                const newCell = newRows[rowIndex][colIndex];
                if (typeof newCell !== "string") {
                    (newCell as HeaderType).isVisible = isVisible;
                }
                return newRows;
            }
            return newRows;
        });
    }
    return {
        rows,
        addRow,
        addCol,
        deleteRow,
        deleteColumn,
        editCell,
    }
}