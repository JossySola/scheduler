"use client"
import { Specs, useAnthropic, useTableHandlers, useTableSpecs } from "@/app/hooks/custom";
import YTable from "./mol-YTable";
import TableButtonSave from "../atoms/atom-table-button-save";
import { TableSpecsContext, TableHandlersContext, AnthropicGenerationContext } from "@/app/[lang]/table/context";
import { useEffect } from "react";
import AISection from "./mol-AI-section";
import XList from "./mol-XList";
import CriteriaConflicts from "../atoms/atom-ai-conflicts";

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
        anthropicAction,
        anthropicState,
        anthropicPending
    } = useAnthropic();
    
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
                <AnthropicGenerationContext.Provider value={{
                    anthropicAction,
                    anthropicPending,
                    anthropicState,
                }}>
                    <section className="w-full h-fit h-max-[160px] overflow-y-scroll pl-5 pr-5 mt-3">
                    {
                        anthropicState && anthropicState.conflicts && anthropicState.conflicts.map((value, index) => <CriteriaConflicts key={ index } text={ value } />)
                    }
                    </section>
                    
                    <YTable 
                    lang={ lang }
                    storedRows={ storedRows } />
                    <TableButtonSave
                    lang={ lang } />
                    <fieldset className="w-full flex flex-col justify-center items-center gap-10 sm:gap-0 sm:flex-row sm:items-start ">
                        <XList name={ lang === "es" ? "Valores a usar" : "Values to use" } />
                        <AISection />
                    </fieldset>
                </AnthropicGenerationContext.Provider>
            </TableHandlersContext.Provider>
        </TableSpecsContext.Provider>
    )
}