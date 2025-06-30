"use client"
import { addToast, Button } from "@heroui/react"
import { FloppyDisk } from "../icons"
import { useParams } from "next/navigation"
import { SaveNewTableAction } from "@/app/[lang]/table/actions";
import { useContext, useEffect } from "react";
import { TableContext } from "@/app/[lang]/table/context";
import { useCallbackAction } from "@/app/hooks/custom";

export default function SaveButton () {
    const params = useParams<{ lang: "es" | "en" }>();
    const { lang } = params;
    const { table } = useContext(TableContext);
    const save = useCallbackAction(
        () => SaveNewTableAction(table.name, table.rows, table.values, table.columnType, table.interval), 
        { ok: false, message: "" }
    );
    useEffect(() => {
        if (save.state.message) {
            addToast({
                title: save.state.message,
                color: save.state.ok ? "success" : "danger",
            })
        }
    }, [save.state]);
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