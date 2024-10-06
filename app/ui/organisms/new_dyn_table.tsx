'use client'
import { useCreateTable } from "@/app/hooks/custom"

export default function NewDynamicTable(): React.JSX.Element {
    const { rows, addColumn, addRow } = useCreateTable();

    return (
        <>
            <form>
                <input type="text" name="name" id="name" placeholder="Untitled table" defaultValue="Untitled table"/>
                <table>
                    {rows}
                </table>
            </form>
            
            <button type="button" onClick={(e) => addColumn()}>Add Column</button>
        </>
    )
}

