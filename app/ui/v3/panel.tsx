"use client"
import Table from "./table";
import { TableContext } from "@/app/[lang]/table/context";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ColumnsActions from "./col-actions";
import RowsActions from "./rows-actions";
import TableSettings from "./table-settings";
import { RowType, TableExtended } from "@/app/lib/utils-client";
import { useForcePanelUpdate } from "@/app/hooks/custom";
import { useParams, useRouter } from "next/navigation";
import { addToast, Button, Input } from "@heroui/react";
import { ArrowCircleLeft } from "../icons";
import Conflicts from "./conflicts";
import { experimental_useObject } from "@ai-sdk/react";
import { tableGenerationSchema } from "@/app/api/generate/schema";
import { useDebouncedCallback } from "use-debounce";

export default function Panel ({ name, stored_rows, stored_values, stored_type, stored_interval }: {
        name? : string,
        stored_rows?: Array<Map<string, RowType>>,
        stored_values?: Array<string>,
        stored_type?: "text" | "date" | "time",
        stored_interval?: number,
}) {
    // STATES
    const [ conflicts, setConflicts ] = useState<Array<string | undefined> | undefined>([]);
    const [ generatedRows, setGeneratedRows ] = useState<Array<{ 
        colIndex: number, rowIndex: number, name: string, value: string, hasConflict: boolean 
    }>>([]);

    // HOOKS
    const router = useRouter();
    const { lang } = useParams<{ lang: "es" | "en" }>();
    const table = useRef<TableExtended>(new TableExtended(
        name ? name : lang === "es" ? "Sin título" : "No title",
        stored_rows && stored_rows,
        stored_values && new Set(stored_values),
        stored_type && stored_type,
        stored_interval && stored_interval,
    ));
    const panelUpdate = useForcePanelUpdate();

    const tableValues = useMemo(() => Array.from(table.current.values), [table.current.values.size]);
    const currentRows = useMemo(() => table.current.rows.map(map => Array.from(map.entries())), [table.current.rows, table.current.size]);

    const { isLoading, object, submit } = experimental_useObject({
        api: '/api/generate',
        schema: tableGenerationSchema,
        onFinish: ({ object }) => {
            if (object !== null && object !== undefined) {
                setConflicts(object.conflicts);
                setGeneratedRows(object.rows);
            }
        },
        onError: () => addToast({
            title: lang === "es" ? "Generación con IA" : "AI Schedule Generation",
            description: lang === "es" ? "Hubo un error al generar el horario con IA. Inténtalo nuevamente y/o reporta este problema." : "An error has occurred while generating the schedule. Please try again and/or report the issue.",
            color: "danger",
        })
    });

    // WORKER
    const genWorker = window.Worker ? new Worker(new URL("../../lib/generation-worker.ts", import.meta.url)) : null;
    
    // EFFECTS
    useEffect(() => {
        if (object !== null && object !== undefined) {
            setConflicts(object.conflicts);
            if (object.rows !== undefined) {
                const streamedRows = object.rows;
                streamedRows?.forEach(row => {
                    if (row !== undefined && row.rowIndex && row.colIndex && row.name) {
                        const cell = table.current.rows[row.rowIndex].get(row.name);
                        if (cell) {
                            cell.value = row.value ?? "";
                            cell.hasConflict = row.hasConflict ?? false;
                        }
                    }
                    return;
                });
                panelUpdate();
            }
        }
    }, [object, panelUpdate]);
    
    useEffect(() => {
        return () => genWorker?.terminate();
    }, [genWorker]);

    // HANDLERS
    const handleGeneration = () => {
        if (!genWorker || !table.current) return;
        
        const serializableRows = currentRows;
        
        genWorker.postMessage(serializableRows);

        genWorker.onmessage = (e) => {
            const rows = e.data;
            const values = tableValues;
            submit({
                rows,
                values,
                lang,
            });
        }
    };

    const handleNameChange = useDebouncedCallback((name: string) => {
        table.current.name = name;
    }, 1000);

    const handleGoBack = useCallback(() => {
        router.back();
    }, [router]);

    return (
        <TableContext.Provider value={{ table: table.current, panelUpdate, setConflicts, generatedRows, isGenerating: isLoading }}>
            <div className="grid grid-cols-[1fr_85vw_1fr] mb-10">
                <header className="col-start-2 col-end-2 flex flex-row justify-start items-center gap-5">
                    <Button isIconOnly 
                    size="lg"
                    aria-label="go back button" 
                    variant="light"
                    onPress={ handleGoBack }>
                        <ArrowCircleLeft width={32} height={32} />
                    </Button>
                    
                    <Input isClearable
                    className="w-full sm:w-1/2" 
                    variant="underlined" 
                    size="lg" 
                    label={ lang === "es" ? "Título" : "Title" }
                    defaultValue={ table.current.name }
                    onValueChange={ handleNameChange }
                    classNames={{
                        input: "text-2xl",
                        clearButton: "p-0 top-[65%]"
                    }} />
                    { conflicts && conflicts.length > 0 && <Conflicts conflicts={ conflicts }/> }
                </header>
            </div>
            
            <section className="grid grid-rows-[auto_auto] grid-cols-[auto_auto]">
                <TableSettings handleGeneration={ handleGeneration } />
                <ColumnsActions />
                <RowsActions />
                <Table />
            </section>
            <section className="flex flex-col">
                <section className="m-5">
                <h2>Rows</h2>
                {
                    table.current.rows && table.current.rows.map((map, index) => <p key={index}>{JSON.stringify(Object.fromEntries(map))}<br></br><br></br></p>)
                }
                </section>
            </section>
        </TableContext.Provider>
    )
}