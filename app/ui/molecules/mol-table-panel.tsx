'use client'
import { useHTMLTable } from "@/app/hooks/custom";
import DynamicTable from "./mol-dyn-table";
import { ActionButton } from "../atoms/atom-button";

export default function TablePanel () {
    const { addRow, addColumn, removeRow, removeColumn, rows, handleInputChange } = useHTMLTable();
    const onlyRows = rows.toSpliced(0, 1);
    const onlyColumns = rows.toSpliced(1, rows.length)[0];
    
    return (
        <>
            <DynamicTable rows={onlyRows} columns={onlyColumns} handleInputChange={handleInputChange} />
            <ActionButton callback={addRow} text={"-Add row"}/>
            <ActionButton callback={addColumn} text={"-Add column"}/>
            <ActionButton callback={removeRow} text={"-Remove row"}/>
            <ActionButton callback={removeColumn} text={"-Remove column"}/>
        </>
    )
}