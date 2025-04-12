"use client"
import { ColSpecs, RowSpecs, useAnthropic } from "@/app/hooks/custom";
import YTable from "./mol-YTable";
import { TableHandlersContext, AnthropicGenerationContext, TableDatabaseContext } from "@/app/[lang]/table/context";
import AISection from "./mol-AI-section";
import XList from "./mol-XList";
import CriteriaConflicts from "../atoms/atom-ai-conflicts";
import { BackButton } from "../atoms/atom-button-back";
import TableNameInput from "../atoms/atom-table-name-input";
import TableButtonSave from "../atoms/atom-table-button-save";
import { Suspense, useEffect, useState } from "react";
import { SettingsSkeleton, TableSkeleton, ValuesSkeleton } from "../atoms/skeletons";

export default function TableWithProvider ({ storedTitle, storedRows, storedRowSpecs, storedValues, storedColSpecs, lang }: {
    lang: "en" | "es",
    storedTitle?: string,
    storedRows?: Array<Array<string>>,
    storedValues?: Array<string>,
    storedColSpecs?: ColSpecs[],
    storedRowSpecs?: RowSpecs[],
}) {
    const {
        anthropicAction,
        anthropicState,
        anthropicPending
    } = useAnthropic();
    const [ rows, setRows ] = useState<Array<Array<string>>>(storedRows ?? []);
    const [ values, setValues ] = useState<Array<string>>(storedValues ?? []);
    const [ colSpecs, setColSpecs ] = useState<Array<ColSpecs>>(storedColSpecs ?? []);
    const [ rowSpecs, setRowSpecs ] = useState<Array<RowSpecs>>(storedRowSpecs ?? []);
    const [ columnHeaders, setColumnHeaders ] = useState<Array<string>>((storedRows && storedRows[0]) ?? []);
    const [ rowHeaders, setRowHeaders ] = useState<Array<string>>((storedRows && storedRows.map(header => header[0])) ?? []);
    const handleAddColumn = (): void => {
        if (!rowHeaders.length && !columnHeaders.length) {
            setRowHeaders([""]);
            setColumnHeaders([""]);
            setRowSpecs([{
                disable: false,
                count: 1,
                enabledValues: [],
                enabledColumns: [],
            }]);
            setColSpecs([{
                numberOfRows: 1,
                amountOfValues: [],
            }]);
            return;
        }
        setColumnHeaders(prev => [...prev, ""]);
        setColSpecs(prev => [...prev, {
            numberOfRows: rowHeaders.length ?? 1,
            amountOfValues: [],
        }]);
    }
    const handleAddRow = (): void => {
        if (!rowHeaders.length && !columnHeaders.length) {
            setRowHeaders([""]);
            setColumnHeaders([""]);
            setRowSpecs([{
                disable: false,
                count: 1,
                enabledValues: [],
                enabledColumns: [],
            }]);
            setColSpecs([{
                numberOfRows: 1,
                amountOfValues: [],
            }]);
            return;
        }
        setRowHeaders(prev => [...prev, ""]);
        setRowSpecs(prev => [...prev, {
            disable: false,
            count: columnHeaders.length ?? 1,
            enabledValues: [],
            enabledColumns: [],
        }]);
    }
    const handleDeleteColumn = (): void => {
        if (!columnHeaders.length) return;
        if (columnHeaders && columnHeaders.length === 1) {
            setRowHeaders([])
            setColumnHeaders([])
            setRowSpecs([])
            setColSpecs([]);
            return;
        }
        setColumnHeaders(prev => prev.slice(0, -1));
        setColSpecs(prev => prev.slice(0, -1));
    }
    const handleDeleteRow = (): void => {
        if (!rowHeaders.length) return;
        if (rowHeaders && rowHeaders.length === 1) {
            setRowHeaders([])
            setColumnHeaders([])
            setRowSpecs([])
            setColSpecs([]);
            return;
        };
        setRowHeaders(prev => prev.slice(0, -1));
        setRowSpecs(prev => prev.slice(0, -1));
    }
    useEffect(() => {
        if (anthropicState.rows) {
            setRows(anthropicState.rows);
        }
    }, [anthropicState]);
    return (
        <TableHandlersContext.Provider value={{
            values, setValues,
            colSpecs, setColSpecs,
            rowSpecs, setRowSpecs,
            columnHeaders, setColumnHeaders,
            rowHeaders, setRowHeaders,
            handleAddColumn,
            handleAddRow,
            handleDeleteColumn,
            handleDeleteRow,
        }}>
            <TableDatabaseContext.Provider value={{
                storedTitle,
                storedRows,
                storedValues,
                storedRowSpecs,
                storedColSpecs,
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
                    <div className="w-full grid grid-rows-[auto_auto_auto_auto] sm:grid-cols-[1fr_1fr_1fr] sm:grid-rows-[auto_auto] gap-4 p-3 mb-8">
                        <div className="row-start-1 sm:col-start-1 flex flex-row items-center justify-center">
                            <BackButton />
                        </div>
                        <div className="row-start-2 sm:row-start-1 sm:col-start-2 flex flex-row items-center justify-center">
                            <TableNameInput name={ storedTitle ? storedTitle : lang === "es" ? "Sin título" : "No title yet" } />
                        </div>
                        <div className="w-full row-start-4 sm:row-start-2 sm:col-span-3 flex flex-col items-center justify-center">
                            <Suspense fallback={ <TableSkeleton /> }>
                                <YTable 
                                lang={ lang }
                                rows={ rows } />
                            </Suspense>
                            <fieldset className="w-full flex flex-col flex-wrap justify-center items-center md:flex-nowrap sm:flex-row sm:items-start ">
                                <Suspense fallback={ <ValuesSkeleton /> }>
                                    <XList name={ lang === "es" ? "Valores a usar" : "Values to use" } />
                                </Suspense>
                                <Suspense fallback={ <SettingsSkeleton /> }>
                                    <AISection />
                                </Suspense>
                            </fieldset>
                        </div>
                        <div className="w-full row-start-3 sm:row-start-1 sm:col-start-3 flex flex-row items-center justify-center">
                            <TableButtonSave lang={ lang } />
                        </div>
                    </div>
                </AnthropicGenerationContext.Provider>
            </TableDatabaseContext.Provider>
        </TableHandlersContext.Provider>
    )
}