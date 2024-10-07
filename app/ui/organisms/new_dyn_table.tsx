'use client'
import { useTable } from "@/app/hooks/custom"

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
            <button type="button" onClick={(e) => addColumn()}>Add Column</button>
            <button type="button" onClick={(e) => addRow()}>Add Row</button>
        </>
    )
}