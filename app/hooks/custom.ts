"use client"
import { useActionState, useCallback, useState } from "react";
import { generateTableAction } from "../[lang]/table/actions";
import { useParams } from "next/navigation";

export type RowSpecs = {
    disable:boolean,
    count: number,
    enabledValues: Array<string>,
    enabledColumns: Array<string>,
}
export type ColSpecs = {
    numberOfRows: number,
    amountOfValues: Array<number>,
}

export function useAnthropic () {
    const params = useParams()
    const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang ?? "en";;
    const [ anthropicState, anthropicAction, anthropicPending ] = useActionState(generateTableAction, { lang, rows: [], conflicts: [] });
    return {
        anthropicAction,
        anthropicPending,
        anthropicState,
    }
}
export function useForcePanelUpdate () {
    const [, setState] = useState(true);
    const panelUpdate = useCallback(() => {
        setState(x => !x);
    }, []);
    return panelUpdate;
}
export function useSettingsUpdate () {
    const [, setState] = useState(true);
    const settingsUpdate = useCallback(() => {
        setState(x => !x);
    }, []);
    return settingsUpdate;
}