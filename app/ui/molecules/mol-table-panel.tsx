'use client'
import { useHTMLTable } from "@/app/hooks/custom";
import DynamicTable from "./mol-table-dynamic";
import { ActionButton } from "../atoms/atom-button";
import { useEffect, useMemo } from "react";

export default function TablePanel ({ rowsProp }: {
    rowsProp?: Array<Array<{id: string, value: string}>>,
}) {
    const { rows, columns, setRows, addRow, addColumn, removeRow, removeColumn} = useHTMLTable();
    
    useEffect(() => {
        if (rowsProp) {
            setRows(rowsProp);
        }
    }, [rowsProp])

    const memoizedRows = useMemo(() => rows, [rows]);
    const memoizedColumns = useMemo(() => columns, [columns]);
    
    return (
        <>
            <DynamicTable rows={memoizedRows} columns={memoizedColumns} setRows={setRows}/>
            <ActionButton callback={addRow} text={"-Add row"}/>
            <ActionButton callback={addColumn} text={"-Add column"}/>
            <ActionButton callback={removeRow} text={"-Remove row"}/>
            <ActionButton callback={removeColumn} text={"-Remove column"}/>
        </>
    )
}