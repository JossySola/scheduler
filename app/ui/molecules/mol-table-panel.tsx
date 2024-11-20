'use client'
import { useHTMLTable } from "@/app/hooks/custom";
import DynamicTable from "./mol-table-dynamic";
import { ActionButton } from "../atoms/atom-button";
import { useEffect } from "react";

export default function TablePanel ({ rowsProp }: {
    rowsProp?: Array<Array<{id: string, value: string}>>,
}) {
    const { rows, columns, setRows, addRow, addColumn, removeRow, removeColumn, handleInputChange} = useHTMLTable();
    
    useEffect(() => {
        if (rowsProp) {
            setRows(rowsProp);
        }
    }, [rowsProp])
    
    return (
        <>
            <DynamicTable rows={rows} columns={columns} handleInputChange={handleInputChange} />
            <ActionButton callback={addRow} text={"-Add row"}/>
            <ActionButton callback={addColumn} text={"-Add column"}/>
            <ActionButton callback={removeRow} text={"-Remove row"}/>
            <ActionButton callback={removeColumn} text={"-Remove column"}/>
        </>
    )
}