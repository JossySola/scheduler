'use client'
import { useHTMLTable } from "@/app/hooks/custom"
import { ActionButton } from "../atoms/button"
import Table from "../atoms/table";

export default function NewDynamicTable(): React.JSX.Element {
    const { columns, rows, addColumn, addRow } = useHTMLTable();

    return (
        <>
            <form>
                <input type="text" name="name" id="name" placeholder="Untitled table" defaultValue="Untitled table"/>
                
                <Table columns={columns} rows={rows} />
            </form>
            <ActionButton callback={addColumn} text='Add Column' />
            <ActionButton callback={addRow} text='Add Row' />
        </>
    )
}