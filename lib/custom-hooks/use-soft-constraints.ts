"use client"
import { useState } from "react";

export default function useSoftConstraints(initialState: {
    valuesInColumn: Map<string, Map<string, number>>,
    valuesInRow: Map<string, Set<string>>,
} = { valuesInColumn: new Map(), valuesInRow: new Map() }) {
    // Use X value N times in <Y column>
    const [valuesInColumn, setValuesInColumn] = useState<Map<string, Map<string, number>>>(initialState.valuesInColumn);
    // Use X values in <Y row>
    const [valuesInRow, setValuesInRow] = useState<Map<string, Set<string>>>(initialState.valuesInRow);

    const addValueInColumn = (value: string, count: number, column: string) => {
        setValuesInColumn(prev => {
            const colsMap = prev;
            const previousValues = prev.get(column);
            if (previousValues) {
                previousValues.set(value, count);
                colsMap.set(column, previousValues);
                return colsMap;
            }
            const newValuesMap = new Map();
            newValuesMap.set(value, count);
            colsMap.set(column, newValuesMap);
            return colsMap;
        });
    }
    const addValueInRow = (value: string, rowId: string) => {
        setValuesInRow(prev => {
            const newMap = prev;
            const currentValues = newMap.get(rowId);
            if (currentValues) {
                currentValues.add(value);
                newMap.set(rowId, currentValues);
                return newMap;
            }
            const newValue: Set<string> = new Set();
            newValue.add(value)
            newMap.set(rowId, newValue);
            return newMap;
        });
    }
    const editCountInColumn = (value: string, count: number, column: string) => {
        setValuesInColumn(prev => {
            const newMap = prev;
            const previousValues = newMap.get(column);
            if (previousValues) {
                previousValues.set(value, count);
                newMap.set(column, previousValues);
                return newMap;
            }
            const newValuesMap = new Map();
            newValuesMap.set(value, count);
            newMap.set(column, newValuesMap);
            return newMap;
        });
    }
    const editValueInRow = (previousValue: string, newValue: string, rowId: string) => {
        setValuesInRow(prev => {
            const newMap = prev;
            const previousSet = newMap.get(rowId);
            if (previousSet) {
                const currentValue = previousSet.has(previousValue);
                if (currentValue) {
                    previousSet.delete(previousValue);
                    previousSet.add(newValue);
                    newMap.set(rowId, previousSet);
                    return newMap;
                }
                previousSet.add(newValue);
                newMap.set(rowId, previousSet);
                return newMap;
            }
            const newSet: Set<string> = new Set();
            newSet.add(newValue);
            newMap.set(rowId, newSet);
            return newMap;
        });
    }
    const deleteCountInColumn = (value: string, column: string) => {
        setValuesInColumn(prev => {
            const newMap = prev;
            const previousValueMap = newMap.get(column);
            if(previousValueMap) {
                previousValueMap.delete(value);
                newMap.set(column, previousValueMap);
                return newMap;
            }
            return newMap;
        });
    }
    const deleteValueInRow = (value: string, rowId: string) => {
        setValuesInRow(prev => {
            const newMap = prev;
            const currentSet = prev.get(rowId);
            if (currentSet) {
                currentSet.delete(value);
                newMap.set(rowId, currentSet);
                return newMap;
            }
            return newMap;
        });
    }
    return {
        valuesInColumn,
        valuesInRow,
        addValueInColumn,
        addValueInRow,
        editCountInColumn,
        editValueInRow,
        deleteCountInColumn,
        deleteValueInRow,
    }
}