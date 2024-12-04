import TablePanel from "../molecules/mol-table-panel"

export default function SaveTableForm() {
    
    return (
        <>
            <input name="table-name" id="table-name" type="text" placeholder="Untitled" />
            <TablePanel />
        </>
    )
}