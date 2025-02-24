"use client"
import { useActionState, SetStateAction, useEffect } from "react";
import XTable from "./mol-XTable";
import { SaveTableAction, UseAiAction } from "@/app/[lang]/table/actions";
import { ActionButton, PrimaryButton } from "../atoms/atom-button";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Divider, Form, Input } from "@heroui/react";
import { Box, FloppyDisk } from "geist-icons";

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
        <Form className="flex flex-col items-center gap-12 w-full">
            <input type="text" name="user_email" id="user_email" value={session?.user?.email ? session.user.email : ""} hidden readOnly />
            <input type="text" name="table_id" id="table_id" value={params && params.id ? params.id : ""} hidden readOnly />
            <Divider orientation="horizontal" className="m-4"/>
            <fieldset className="flex flex-row gap-4">
                <Input 
                    isClearable
                    autoComplete="off"
                    type="text" 
                    name="table_title" 
                    id="table_title" 
                    variant="underlined" 
                    size="lg" 
                    className="w-fit"
                    value={title} 
                    onChange={e => {
                    if (title && setTitle) {
                        setTitle(e.target.value);
                    }
                }}/>
                { children }
            </fieldset>
            
            
            <XTable rows={rows} setRows={setRows} values={values} cols={cols} />
            <Divider orientation="horizontal" />
            <p>{ saveState.message }</p>
            <fieldset className="flex flex-row justify-center items-center w-full">
                {
                    session?.user ? 
                    <ActionButton 
                    type="submit" 
                    formAction={saveAction} 
                    loading={savePending} 
                    disabled={savePending} 
                    endContent={<FloppyDisk width="16px" />}>
                        {savePending ? saving : save}
                    </ActionButton> 
                    : null
                }
                <PrimaryButton 
                type="submit" 
                formAction={aiAction} 
                loading={aiPending} 
                disabled={aiPending} 
                endContent={<Box />}>
                    {aiPending ? creating : create}
                </PrimaryButton>
            </fieldset>
        </Form>
    )
}