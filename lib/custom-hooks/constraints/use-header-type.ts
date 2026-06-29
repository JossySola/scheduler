"use client"
import { useState } from "react";

export default function useHeaderType(initialState: {
    rowsType: "text" | "date" | "time",
    colsType: "text" | "date" | "time",
} = { rowsType: "text", colsType: "text" }) {
    const [rowsType, setRowsType] = useState<string>(initialState.rowsType);
    const [colsType, setColsType] = useState<string>(initialState.colsType);

    const changeRowsType = (newType: "text" | "date" | "time") => setRowsType(newType);
    const changeColsType = (newType: "text" | "date" | "time") => setColsType(newType);

    return {
        rowsType,
        colsType,
        changeColsType,
        changeRowsType,
    }
}