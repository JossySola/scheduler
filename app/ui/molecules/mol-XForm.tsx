"use client"
import { useActionState, SetStateAction, useEffect, useState } from "react";
import XTable from "./mol-XTable";
import { SaveTableAction, UseAiAction } from "@/app/(routes)/table/actions";
import { SubmitButton } from "../atoms/atom-button";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export default function XForm ({ id, children, rows, setRows, values }: 
    { 
        children: React.JSX.Element,
        id?: string,
        rows?: Array<Array<string>>,
        setRows?: React.Dispatch<SetStateAction<string[][]>>,
        values?: Array<string>,
     }) {
    const { data: session } = useSession();
    const params = useParams();
    const [ saveState, saveAction, savePending ] = useActionState(SaveTableAction, { message: "" });
    const [ aiState, aiAction, aiPending ] = useActionState(UseAiAction, { message: ""} );
    const [ title, setTitle ] = useState<string>("Untitled table");
    const [ times, setTimes ] = useState<number>(rows && rows.length ? rows.length : 0);

    useEffect(() => {
        setTimes(prevCount => {
            if (rows && rows.length) {
                if (prevCount === rows.length) {
                    return rows.length;
                }
                return prevCount;
            }
            return 0;
        });
    }, [rows])
    
    useEffect(() => {
        if (aiState.response && aiState.response.result) {
            if (setRows) {
                setRows(aiState.response.result);
            }
        }
    }, [aiState])

    return (
        <form id={id ? id : "try"} name={id ? id : "try"}>
            <input type="text" name="user_id" id="user_id" value={id ? id : ""} hidden readOnly />
            <input type="text" name="user_email" id="user_email" value={session?.user?.email ? session.user.email : ""} hidden readOnly />
            <input type="text" name="table_id" id="table_id" value={params && params.id ? params.id : ""} hidden readOnly />
            
            <input type="text" name="table_title" id="table_title" value={title} onChange={e => {
                e.preventDefault();
                setTitle(e.target.value);
            }}/>
            
            <XTable rows={rows} setRows={setRows} values={values}/>
            { children }
            {
                session?.user ? 
                <SubmitButton text={savePending ? "Saving..." : "Save"} formaction={saveAction} disabled={savePending} /> 
                : null
            }

            <label>
                Fill each column with at least <input type="number" name={`Specification[]-fill-all-columns-with-at-least-${times}-values`} max={rows && rows.length} value={times} onChange={e => {
                    e.preventDefault();
                    setTimes(parseInt(e.target.value, 10) || 0);
                }}/> times.
            </label>

            <SubmitButton text={aiPending ? "Creating..." : "Create"} formaction={aiAction} disabled={aiPending} />
        </form>
    )
}