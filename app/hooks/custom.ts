"use client"
import { SetStateAction, useState } from "react";
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { z } from 'zod';
import { generateTableAction } from "../[lang]/table/actions";
import { readStreamableValue } from "ai/rsc";

export type Specs = {
    disable:boolean,
    count: number,
    enabledValues: Array<string>,
    enabledColumns: Array<string>,
}

export function useTableSpecs () {
    const [ values, setValues ] = useState<Array<string>>([]);
    const [ colSpecs, setColSpecs ] = useState<Array<number>>([]);
    const [ specs, setSpecs ] = useState<Array<Specs>>([]);
    return {
        values,
        setValues,
        colSpecs,
        setColSpecs,
        specs,
        setSpecs,
    }
}
export function useTableHandlers (setSpecs: React.Dispatch<SetStateAction<Array<Specs>>>) {
    const [ columnHeaders, setColumnHeaders ] = useState<Array<string>>([]);
    const [ rowHeaders, setRowHeaders ] = useState<Array<string>>([]);

    const handleAddColumn = (): void => {
        setColumnHeaders(prev => prev ? [...prev, ""] : [""]);
    }
    const handleAddRow = (): void => {
        if (!rowHeaders.length) setColumnHeaders([""]);
        setRowHeaders(prev => [...prev, ""]);
        setSpecs(prev => [...prev, {
            disable: false,
            count: columnHeaders && columnHeaders.length,
            enabledValues: [],
            enabledColumns: [],
        }])
    }
    const handleDeleteColumn = (): void => {
        if (!columnHeaders.length) return;
        if (columnHeaders.length === 1) {
            setColumnHeaders([])
            setRowHeaders([])
        };
        return setColumnHeaders(prev => prev.slice(0, -1));
    }
    const handleDeleteRow = (): void => {
        if (!rowHeaders.length) return;
        if (rowHeaders.length === 1) {
            setRowHeaders([])
            setColumnHeaders([])
        };
        return setRowHeaders(prev => prev.slice(0, -1));
    }
    return {
        setColumnHeaders,
        setRowHeaders,
        columnHeaders,
        rowHeaders,
        handleAddColumn,
        handleAddRow,
        handleDeleteColumn,
        handleDeleteRow,
    }
}
export function useAI () {
    // RSC
    const [ generation, setGeneration ] = useState<string>('');
    const generateTableRSC = async (formData: FormData) => {
        const { object } = await generateTableAction(formData);
        for await (const partialObject of readStreamableValue(object)) {
            if (partialObject) {
                setGeneration(
                    JSON.stringify(partialObject.rows, null, 2)
                )
            }
        }
    }
    
    // useObject
    const { object, submit, isLoading } = useObject({
        api: '/api/ai',
        schema: z.object({
            rows: z.array(z.array(z.string()))
        }),
    })
    const generateTableUseObject = (formData: FormData) => {
        // Extract and validate form data before sending
        const entries = [...formData.entries()];
        const payload = {
            rows: [[]] as string[][], 
            values: entries.filter(([key]) => key.startsWith("ValueOption")).map(([, value]) => value.toString()),
            specs: entries.filter(([key]) => key.startsWith("Specification")).map(([, value]) => value.toString()),
        };

        // Process table cells (like A1, B2, etc.)
        entries
            .filter(([key]) => /^[A-Z][0-9]+$/.test(key))
            .forEach(([key, value]) => {
                const rowIndex = Number(key.slice(1));
                if (!payload.rows[rowIndex]) payload.rows[rowIndex] = [];
                payload.rows[rowIndex].push(value.toString());
            });

        // 🔥 Send the validated payload to the API
        submit(payload);
    }
    return {
        object,
        submit,
        isLoading,
        generation,
        setGeneration,
        generateTableRSC,
        generateTableUseObject,
    }
}