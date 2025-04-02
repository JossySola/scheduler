"use client"
import { SaveTableAction } from "@/app/[lang]/table/actions"
import { useActionState, useContext, useEffect } from "react"
import { ActionButton } from "./atom-button";
import { FloppyDisk } from "geist-icons";
import { addToast } from "@heroui/react";
import { TableSpecsContext, TableSpecsType } from "@/app/[lang]/table/context";

export default function TableButtonSave ({ lang }: {
    lang: "en" | "es",
}) {
    const { values, colSpecs, specs }: TableSpecsType = useContext(TableSpecsContext);
    const initialState = {
        message: "",
        ok: false,
    }
    const boundAction = (state: { message: string, ok: boolean }, formData: FormData) => {
        return SaveTableAction(state, formData, { values, colSpecs, specs });
    };
    const [ saveState, saveAction, savePending ] = useActionState(boundAction, initialState);
    
    useEffect(() => {
        if (saveState.message) {
            addToast({
                title: saveState.message,
                color: saveState.ok ? "success" : "danger",
            })
        }
    }, [saveState]);

    return (
        <ActionButton 
        type="submit"
        formAction={ saveAction }
        loading={ savePending }
        disabled={ savePending }
        endContent={<FloppyDisk width="16px" />}>
            { lang === "es" ? "Guardar" : "Save" }
        </ActionButton>
    )
}