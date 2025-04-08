"use client"
import { ColSpecs, RowSpecs, useAnthropic, useTableHandlers, useTableSpecs } from "@/app/hooks/custom";
import YTable from "./mol-YTable";
import { TableSpecsContext, TableHandlersContext, AnthropicGenerationContext } from "@/app/[lang]/table/context";
import { useEffect } from "react";
import AISection from "./mol-AI-section";
import XList from "./mol-XList";
import CriteriaConflicts from "../atoms/atom-ai-conflicts";
import { BackButton } from "../atoms/atom-button-back";
import TableNameInput from "../atoms/atom-table-name-input";
import TableButtonSave from "../atoms/atom-table-button-save";

export default function TableWithProvider ({ storedTitle, storedRows, storedRowSpecs, storedValues, storedColSpecs, lang }: {
    lang: "en" | "es",
    storedTitle?: string,
    storedRows?: Array<Array<string>>,
    storedValues?: Array<string>,
    storedColSpecs?: ColSpecs[],
    storedRowSpecs?: RowSpecs[],
}) {
    const {
        values,
        setValues,
        colSpecs,
        setColSpecs,
        rowSpecs,
        setRowSpecs,
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
    } = useTableHandlers(setRowSpecs, setColSpecs);
    const {
        anthropicAction,
        anthropicState,
        anthropicPending
    } = useAnthropic();
    
    useEffect(() => {
        if (storedRowSpecs) setRowSpecs(storedRowSpecs);
        if (storedColSpecs) setColSpecs(storedColSpecs);
        if (storedValues) setValues(storedValues);
        if (storedRows) {
            setColumnHeaders(storedRows[0]);
            setRowHeaders(storedRows.map(row => row[0]));
        }
    }, [storedRowSpecs, storedColSpecs, storedValues, storedRows]);
    return (
        <section>
            <TableSpecsContext.Provider value={{
            values,
            setValues,
            colSpecs,
            setColSpecs,
            rowSpecs,
            setRowSpecs,
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
                        <section className="w-full h-fit h-max-[160px] overflow-y-scroll pl-5 pr-5">
                        {
                            anthropicState && anthropicState.conflicts && anthropicState.conflicts.map((value, index) => <CriteriaConflicts key={ index } text={ value } />)
                        }
                        </section>
                        <div className="grid grid-rows-[auto_auto_auto_auto] sm:grid-cols-[1fr_1fr_1fr] sm:grid-rows-[auto_auto] gap-4 m-8">
                            <div className="row-start-1 sm:col-start-1 flex flex-row items-center justify-center">
                                <BackButton />
                            </div>
                            <div className="row-start-2 sm:row-start-1 sm:col-start-2 flex flex-row items-center justify-center">
                                <TableNameInput name={ storedTitle ? storedTitle : lang === "es" ? "Sin título" : "No title yet" } />
                            </div>
                            <div className="row-start-4 sm:row-start-2 sm:col-span-3 flex flex-col items-center justify-center">
                                <YTable 
                                lang={ lang }
                                storedRows={ storedRows } />
                                <fieldset className="w-full flex flex-col justify-center items-center sm:flex-row sm:items-start ">
                                    <XList name={ lang === "es" ? "Valores a usar" : "Values to use" } />
                                    <AISection />
                                </fieldset>
                            </div>
                            <div className="row-start-3 sm:row-start-1 sm:col-start-3 flex flex-row items-center justify-center">
                                <TableButtonSave lang={ lang } />
                            </div>
                        </div>
                    </AnthropicGenerationContext.Provider>
                </TableHandlersContext.Provider>
            </TableSpecsContext.Provider>
        </section>
    )
}