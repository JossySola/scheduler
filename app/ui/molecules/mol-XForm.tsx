"use client"
import { useActionState, SetStateAction } from "react";
import XTable from "./mol-XTable";
import { SaveTableAction } from "@/app/(routes)/table/actions";
import { SubmitButton } from "../atoms/atom-button";
import { v4 as uuidv4 } from "uuid";

export default function XForm ({ id, rows, setRows }: 
    { 
        id: string,
        rows?: Array<Array<string>>,
        setRows?: React.Dispatch<SetStateAction<string[][]>>
     }) {
    const [ saveState, saveAction, savePending ] = useActionState(SaveTableAction, { message: "" });
    
    return (
        <form id={id ? id : "try"} name={id ? id : "try"}>
            <input type="text" name="table_title" id="table_title" defaultValue="Untitled table" />
            
            <XTable id={id} rows={rows} setRows={setRows} />

            <SubmitButton text={savePending ? "Saving..." : "Save"} formaction={saveAction} disabled={savePending} />
        </form>
    )
}