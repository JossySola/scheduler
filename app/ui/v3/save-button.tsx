"use client"
import { addToast, Button } from "@heroui/react"
import { FloppyDisk } from "../icons"
import { redirect, useParams } from "next/navigation"
import { SaveNewTableAction, SaveTableAction } from "@/app/[lang]/table/actions";
import { useContext, useEffect } from "react";
import { TableContext } from "@/app/[lang]/table/context";
import { useCallbackAction } from "@/app/hooks/custom";

export default function SaveButton () {
    const params = useParams<{ lang: "es" | "en", id?: string }>();
    const { lang, id } = params;
    const { table } = useContext(TableContext);
    const newSave = useCallbackAction(
        () => SaveNewTableAction(table.name, table.rows, table.values, table.columnType, table.interval), 
        { ok: false, message: "", id: null }
    );
    const save = id ? useCallbackAction(
        () => SaveTableAction(table.name, table.rows, table.values, table.columnType, table.interval, id),
        { ok: false, message: "" }
    ) : null;

    useEffect(() => {
        if (newSave.state.message) {
            addToast({
                title: newSave.state.message,
                color: newSave.state.ok ? "success" : "danger",
            })
            if (newSave.state.id) {
                redirect(`${process.env.NEXT_PUBLIC_ORIGIN}/${lang}/table/${newSave.state.id}`);
            }
        }
    }, [newSave.state]);
    useEffect(() => {
        if (save && save.state.message) {
            addToast({
                title: save.state.message,
                color: save.state.ok ? "success" : "danger",
            })
        }
    }, [save?.state]);

    if (id && save) {
        return (
            <Button
            type="button"
            size="lg"
            className="dark:bg-white bg-black dark:text-black text-white text-lg"
            endContent={<FloppyDisk />}
            isLoading={ save.isPending }
            onPress={ save.run }>
                { lang === "es" ? "Guardar" : "Save" }
            </Button>
        )
    }
    return (
        <Button
        type="button"
        size="lg"
        className="dark:bg-white bg-black dark:text-black text-white text-lg"
        endContent={<FloppyDisk />}
        isLoading={ newSave.isPending }
        onPress={ newSave.run }>
            { lang === "es" ? "Guardar" : "Save" }
        </Button>
    )
}