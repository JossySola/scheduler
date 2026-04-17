"use client"
import { useState } from "react";

export default function useValues(initialState: Set<string> = new Set()) {
    const [values, setValues] = useState(initialState);

    const addValue = (value: string): boolean => {
        if (values.has(value)) return false;
        setValues(prev => prev.add(value));
        return true;
    }
    const deleteValue = (value: string): boolean => {
        if (!values.has(value)) return false;
        setValues(prev => {
            const newSet = prev;
            newSet.delete(value);
            return newSet;
        });
        return true;
    }
    const editValue = (pastValue: string, newValue: string) => {
        if (!values.has(pastValue)) return false;
        setValues(prev => {
            const newSet = prev;
            newSet.delete(pastValue);
            newSet.add(newValue);
            return newSet;
        });
        return true;
    }
    return {
        addValue,
        deleteValue,
        editValue,
        values,
    }
}