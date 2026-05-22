"use client"
import { useState } from "react";

export default function useStructuralConstraints(initialState: Map<string, Set<string>> = new Map()) {
    // <In X column> fill Y rows
    const [fillRows, setFillRows] = useState(initialState);

    const addRowInColConstraint = (row: string, column: string) => {
        setFillRows(prev => {
            const newMap = prev;
            const previousSet = newMap.get(column);
            if (previousSet) {
                previousSet.add(row);
                newMap.set(column, previousSet);
                return newMap;
            }
            const newSet: Set<string> = new Set();
            newSet.add(row);
            newMap.set(column, newSet);
            return newMap;
        })
    }
    const editRowInColConstraint = (row: string, column: string) => {

    }
    const deleteRowInColConstraint = (row: string, column: string) => {

    }
    return {
        addRowInColConstraint,
        editRowInColConstraint,
        deleteRowInColConstraint,
    }
}