"use client"
import { useActionState, SetStateAction, useEffect } from "react";
import XTable from "./mol-XTable";
import { SaveTableAction, UseAiAction } from "@/app/[lang]/table/actions";
import { ActionButton } from "../atoms/atom-button";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export default function XForm ({ id, cols, title, setTitle, children, rows, setRows, values, setValues }: 
    { 
        children: React.JSX.Element,
        cols?: Array<number>,
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
    const { lang } = params;
    const [ saveState, saveAction, savePending ] = useActionState(SaveTableAction, { message: "" });
    const [ aiState, aiAction, aiPending ] = useActionState(UseAiAction, { message: ""} );
    const saving = lang === "es" ? "Guardando..." : "Saving...";
    const save = lang === "es" ? "Guardar" : "Save";
    const creating = lang === "es" ? "Creando..." : "Creating...";
    const create = lang === "es" ? "Crear" : "Create";
    
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
                if (title && setTitle) {
                    setTitle(e.target.value);
                }
            }}/>
            
            <XTable rows={rows} setRows={setRows} values={values} cols={cols} />
            { children }
            {
                session?.user ? 
                <ActionButton text={savePending ? saving : save} formaction={saveAction} disabled={savePending} action="save_table"/> 
                : null
            }

            <ActionButton text={aiPending ? creating : create} formaction={aiAction} disabled={aiPending} action="autofill_table"/>
        </form>
    )
}