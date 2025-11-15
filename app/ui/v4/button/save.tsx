"use client"
import { addToast, Button } from "@heroui/react";
import { redirect, useParams } from "next/navigation";
import { FloppyDisk } from "../../icons";
import { StatesType, useCallbackAction } from "@/app/hooks/custom";
import { SaveNewTableAction, SaveTableAction } from "@/app/[lang]/table/actions";
import { useEffect } from "react";

export default function SaveButton({ states }: { states: StatesType }) {
    const { lang, id } = useParams<{ lang: "en" | "es", id?: string }>();
    
    const newSave = useCallbackAction(
        () => SaveNewTableAction(states),
        { ok: false, message: "", id: null}
    );
    const save = id ? useCallbackAction(
        () => SaveTableAction(states, id),
        { ok: false, message: ""}
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

    const isNew = !id && !save;
    return (
        <Button
        type="button"
        aria-label={lang === "es" ? "Guardar tabla" : "Save table"}
        size="lg"
        endContent={<FloppyDisk />}
        isLoading={isNew ? newSave.isPending : save ? save.isPending : false}
        isDisabled={isNew ? newSave.isPending : save ? save.isPending : false}
        onPress={() => {
            if (isNew) {
                newSave.run();
            } else if (save) {
                save.run();
            }
        }}
        className="dark:bg-white bg-black dark:text-black text-white text-lg">
            {lang === "es" ? "Guardar" : "Save"}
        </Button>
    )
}