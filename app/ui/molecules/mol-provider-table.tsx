"use client"
import { Specs, useAI, useTableHandlers, useTableSpecs } from "@/app/hooks/custom";
import YTable from "./mol-YTable";
import TableButtonSave from "../atoms/atom-table-button-save";
import { TableSpecsContext, TableHandlersContext, TableAiGenerationContext } from "@/app/[lang]/table/context";
import { useEffect } from "react";
import AISection from "./mol-AI-section";
import XList from "./mol-XList";

export default function TableWithProvider ({ storedRows, storedSpecs, storedValues, storedColSpecs, lang }: {
    lang: "en" | "es",
    storedRows?: Array<Array<string>>,
    storedValues?: Array<string>,
    storedColSpecs?: Array<number>,
    storedSpecs?: Specs[],
}) {
    const {
        values,
        setValues,
        colSpecs,
        setColSpecs,
        specs,
        setSpecs,
    } = useTableSpecs();
    const {
        setColumnHeaders,
        setRowHeaders,
        columnHeaders,
        rowHeaders,
        handleAddColumn,
        handleAddRow,
        handleDeleteColumn,
        handleDeleteRow,
    } = useTableHandlers(setSpecs);
    const {
        object,
        submit,
        isLoading,
        generation,
        setGeneration,
        generateTableRSC,
        generateTableUseObject,
    } = useAI();
    
    useEffect(() => {
        if (storedSpecs) setSpecs(storedSpecs);
        if (storedColSpecs) setColSpecs(storedColSpecs);
        if (storedValues) setValues(storedValues);
        if (storedRows) {
            setColumnHeaders(storedRows[0]);
            setRowHeaders(storedRows.map(row => row[0]));
        }
    }, [storedSpecs, storedColSpecs, storedValues, storedRows]);

    return (
        <TableSpecsContext.Provider value={{
            values,
            setValues,
            colSpecs,
            setColSpecs,
            specs,
            setSpecs,
        }}>
            <TableHandlersContext.Provider value={{
                setColumnHeaders,
                setRowHeaders,
                columnHeaders,
                rowHeaders,
                handleAddColumn,
                handleAddRow,
                handleDeleteColumn,
                handleDeleteRow,
            }}>
                <TableAiGenerationContext.Provider value={{
                    object,
                    submit,
                    isLoading,
                    generation,
                    setGeneration,
                    generateTableRSC,
                    generateTableUseObject,
                }}>
                    <YTable 
                    lang={ lang }
                    storedRows={ storedRows } />
                    <TableButtonSave
                    lang={ lang } />
                    <fieldset className="w-full flex flex-col justify-center items-center gap-10 sm:gap-0 sm:flex-row sm:items-start ">
                        <XList name={ lang === "es" ? "Valores a usar" : "Values to use" } />
                        <AISection />
                    </fieldset>
                </TableAiGenerationContext.Provider>
            </TableHandlersContext.Provider>
        </TableSpecsContext.Provider>
    )
}