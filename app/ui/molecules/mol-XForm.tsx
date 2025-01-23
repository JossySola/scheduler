"use client"
import { useActionState, SetStateAction, useEffect, useState } from "react";
import XTable from "./mol-XTable";
import { SaveTableAction, UseAiAction } from "@/app/(routes)/table/actions";
import { ActionButton } from "../atoms/atom-button";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export default function XForm ({ id, preferences, title, setTitle, children, rows, setRows, values, setValues }: 
    { 
        children: React.JSX.Element,
        preferences?: Array<Array<string>>,
        title?: string,
        setTitle?: React.Dispatch<SetStateAction<string>>,
        id?: string,
        rows?: Array<Array<string>>,
        setRows?: React.Dispatch<SetStateAction<string[][]>>,
        values?: Array<string>,
        setValues?: React.Dispatch<SetStateAction<string[]>>,
     }) {
    const { data: session } = useSession();
    const params = useParams();
    const [ saveState, saveAction, savePending ] = useActionState(SaveTableAction, { message: "" });
    const [ aiState, aiAction, aiPending ] = useActionState(UseAiAction, { message: ""} );
    const [ times, setTimes ] = useState<number>(() => {
        if (preferences) {
            const result = preferences.find(subArray => subArray[0].startsWith(`Specification[]-fill-all-columns-with-at-least`));
            if (result) {
                return parseInt(result[1], 10);
            }
        }
        return 0;
    });

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
                if (title && setTitle) {
                    setTitle(e.target.value);
                }
            }}/>
            
            <XTable rows={rows} setRows={setRows} values={values}/>
            { children }
            {
                session?.user ? 
                <ActionButton text={savePending ? "Saving..." : "Save"} formaction={saveAction} disabled={savePending} action="save_table"/> 
                : null
            }

            <label>
                Fill each column with at least <input type="number" name={`Specification[]-fill-all-columns-with-at-least-${times}-values`} min={0} max={rows && rows.length} value={times} onChange={e => {
                    e.preventDefault();
                    setTimes(parseInt(e.target.value, 10) || 0);
                }}/> times.
            </label>

            <ActionButton text={aiPending ? "Creating..." : "Create"} formaction={aiAction} disabled={aiPending} action="autofill_table"/>
        </form>
    )
}