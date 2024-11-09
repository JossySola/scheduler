'use client'
import { useHTMLTable } from "@/app/hooks/custom";
import Table from "../atoms/atom-table";
import { ActionButton } from "../atoms/atom-button";

export default function DynamicTable () {
    const { addRow, addColumn, removeRow, removeColumn, rows } = useHTMLTable();
    const onlyRows = rows.toSpliced(0, 1);
    const onlyColumns = rows.toSpliced(1, rows.length)[0];
    
    return (
        <>
            <Table rows={onlyRows} columns={onlyColumns}/>
            <ActionButton callback={addRow} text={"-Add row"}/>
            <ActionButton callback={addColumn} text={"-Add column"}/>
            <ActionButton callback={removeRow} text={"-Remove row"}/>
            <ActionButton callback={removeColumn} text={"-Remove column"}/>
        </>
    )
}