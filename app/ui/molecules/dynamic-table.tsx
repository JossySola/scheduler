'use client'
import { useHTMLTable } from "@/app/hooks/custom"
import { ActionButton } from "../atoms/atom-button"
import Table from "../atoms/atom-table"

export default function DynamicTable(): React.JSX.Element {
    const { 
        columns, 
        rows, 
        addColumn, 
        addRow, 
        popColumn, 
        popRow,
        message
    } = useHTMLTable();

    return (
        <>
            <Table columns={columns} rows={rows} />
            <ActionButton callback={addColumn} text='Add Column' />
            {
                message && <p>{message}</p>
            }
            <ActionButton callback={addRow} text='Add Row' />
            <ActionButton callback={popColumn} text="Remove Column" />
            <ActionButton callback={popRow} text="Remove Row" />
        </>
    )
}