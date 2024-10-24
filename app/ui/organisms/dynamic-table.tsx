'use client'
import { useHTMLTable } from "@/app/hooks/custom"
import { ActionButton } from "../atoms/atom-button"
import Table from "../atoms/atom-table"

export default function NewDynamicTable(): React.JSX.Element {
    const { 
        columns, 
        rows, 
        addColumn, 
        addRow, 
        popColumn, 
        popRow 
    } = useHTMLTable();

    return (
        <>
            <form>
                <input type="text" name="name" id="name" placeholder="Untitled table" defaultValue="Untitled table"/>
                
                <Table columns={columns} rows={rows} />
            </form>
            <ActionButton callback={addColumn} text='Add Column' />
            <ActionButton callback={addRow} text='Add Row' />
            <ActionButton callback={popColumn} text="Remove Column" />
            <ActionButton callback={popRow} text="Remove Row" />
        </>
    )
}