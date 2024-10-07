'use client'
import { useTable } from "@/app/hooks/custom"
import { ActionButton } from "../atoms/button"

export default function NewDynamicTable(): React.JSX.Element {
    const { columns, rows, addColumn, addRow } = useTable();

    return (
        <>
            <form>
                <input type="text" name="name" id="name" placeholder="Untitled table" defaultValue="Untitled table"/>
                
                <table>
                    {columns}
                    <tbody>
                        {rows}
                    </tbody>
                </table>

            </form>
            <ActionButton callback={addColumn} text='Add Column' />
            <ActionButton callback={addRow} text='Add Row' />
        </>
    )
}