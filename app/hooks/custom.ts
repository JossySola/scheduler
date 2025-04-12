"use client"
import { useActionState } from "react";
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
    const lang = params.lang;
    const [ anthropicState, anthropicAction, anthropicPending ] = useActionState(generateTableAction, { rows: [], conflicts: [], lang });
    return {
        anthropicAction,
        anthropicPending,
        anthropicState,
    }
}