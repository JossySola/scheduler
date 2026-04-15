"use client"
import { useState } from "react";
import { generateColumnName } from "../utils";

export default function useRows(initialState: Array<Map<string, string>> = []) {
    const [rows, setRows] = useState(initialState);

    const addRow = () => {
        // Check how many columns will be added in the new row
        const numOfCols = rows[0] ? rows[0].size : 1;
        const newMap = new Map();
        for (let i = 0; i < numOfCols; i++) {
            newMap.set(generateColumnName(i), "");
        }
        setRows(prev => [
            ...prev,
            newMap
        ]);
    }
    const addCol = () => {
        setRows(prev => prev.map(map => map.set(generateColumnName(map.size), "")));
    }
    const deleteRow = () => {
        if (!rows.length) return;
        setRows(prev => {
            prev.pop();
            return prev;
        });
    }
    const getRow = (index: number): Map<string,string> | undefined => {
        return rows[index] ?? undefined;
    }
    const editRow = (index: number, column: string, value: string): boolean => {
        const exists = rows[index] ? rows[index].has(column) : false;
        if (exists) {
            rows[index].set(column, value);
            return true;
        } else {
            return false;
        }
    }
    return {
        rows,
        addRow,
        addCol,
        deleteRow,
        getRow,
        editRow,
    }
}