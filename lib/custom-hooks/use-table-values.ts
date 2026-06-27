"use client"
import { useCallback, useState } from "react";

export default function useValues(initialState: Set<string> = new Set()) {
    const [values, setValues] = useState(initialState);

    const addValue = useCallback((value: string): boolean => {
        if (values.has(value)) return false;
        setValues(prev => {
            const newSet = new Set(Array.from(prev));
            newSet.add(value);
            return newSet;
        });
        return true;
    }, [values]);
    const deleteValue = useCallback((value: string): boolean => {
        if (!values.has(value)) return false;
        setValues(prev => {
            const newSet = new Set(Array.from(prev));
            newSet.delete(value);
            return newSet;
        });
        return true;
    }, [values]);
    const editValue = useCallback((pastValue: string, newValue: string) => {
        if (!values.has(pastValue)) return false;
        setValues(prev => {
            const newSet = new Set(Array.from(prev));
            newSet.delete(pastValue);
            newSet.add(newValue);
            return newSet;
        });
        return true;
    }, [values]);
    const replaceValues = useCallback((newValues: Set<string>) => {
        setValues(newValues);
    }, [values]);
    return {
        addValue,
        deleteValue,
        editValue,
        replaceValues,
        values,
    }
}
