"use client"
import { useState } from "react";
import { generateColumnName } from "../utils";
import { HeaderType, TableState } from "../definitions";

export default function useRows(
    initialState: TableState = []) {
    const [rows, setRows] = useState<TableState>(initialState);
    // Check how many columns will be added in a new row as an initial load
    const maxCols = rows[0] ? rows[0].length : 1;
    
    const addRow = () => {
        setRows(prev => {
            const newArray = prev;
            if (prev.length === 0) {
                const row = new Array(maxCols);
                row.fill({
                    value: "",
                    type: "text",
                    isVisible: true,
                });
                newArray.push(row);
                return newArray;
            }
            const row = new Array(maxCols);
            row.fill({
                value: "",
                type: "text",
                isVisible: true,
            }, 0, 1);
            row.fill("", 1, maxCols - 1);
            newArray.push(row);
            return newArray;
        });
    }
    const addCol = () => {
        setRows(prev => {
            const newArray = prev.map((row, index) => {
                if (index === 0) {
                    const newRow = row;
                    newRow.push({
                        value: "",
                        type: "text",
                        isVisible: true,
                    })
                    return newRow;
                }
                const newRow = row;
                newRow.push("");
                return newRow;
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
            const newRows = prev;
            if (value) {
                const cell = newRows[rowIndex][colIndex];
                if (typeof cell !== "string") {
                    (newRows[rowIndex][colIndex] as HeaderType).value = value;
                } else {
                    newRows[rowIndex][colIndex] = value;
                }
            } else if (type) {
                const cell = newRows[rowIndex][colIndex];
                if (typeof cell !== "string") {
                    (newRows[rowIndex][colIndex] as HeaderType).type = type;
                }
            } else if (isVisible !== undefined) {
                const cell = newRows[rowIndex][colIndex];
                if (typeof cell !== "string") {
                    (newRows[rowIndex][colIndex] as HeaderType).isVisible = isVisible;
                }
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