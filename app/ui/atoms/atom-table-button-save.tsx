"use client"
import { SaveTableAction } from "@/app/[lang]/table/actions"
import { useActionState, useContext, useEffect } from "react"
import { ActionButton } from "./atom-button";
import { addToast } from "@heroui/react";
import { TableHandlersContext, TableHandlersType } from "@/app/[lang]/table/context";
import { FloppyDisk } from "../icons";

export default function TableButtonSave ({ lang }: {
    lang: "en" | "es",
}) {
    const { values, colSpecs, rowSpecs }: TableHandlersType = useContext(TableHandlersContext);
    const initialState = {
        message: "",
        ok: false,
    }
    const boundAction = (state: { message: string, ok: boolean }, formData: FormData) => {
        return SaveTableAction(state, formData, { values, colSpecs, rowSpecs });
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
        endContent={<FloppyDisk />}>
            { lang === "es" ? "Guardar" : "Save" }
        </ActionButton>
    )
}