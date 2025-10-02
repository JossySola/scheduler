"use client"
import { useVirtualizedTable } from "@/app/hooks/custom";
import { addToast, Button, Input } from "@heroui/react";
import { flexRender } from "@tanstack/react-table";
import Filter from "../input/filter";
import { ArrowCircleLeft, ChevronDoubleDown, ChevronDoubleLeft, ChevronDoubleRight, ChevronDoubleUp, Sort, SortAscending, SortDescending } from "../../icons";
import { useParams, useRouter } from "next/navigation";
import Settings from "../drawer/settings";
import SaveButton from "../button/save";
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { tableGenerationSchema } from "@/app/api/generate/schema";
import { SessionProvider } from "next-auth/react";

export default function Table({storedData}: {
    storedData?: {
    user_id: string,
    name: string,
    data: Array<{ [key: string]: string }>,
    values: Array<string>,
    type: Array<string>,
    interval: number,
    cols_specs: { numberOfRows: { [key: string]: number }, amountOfValues: { [key: string]: Array<number> } },
    rows_specs: { disable: { [key: number]: boolean }, count: { [key: string]: number }, enabledValues: { [key: string]: Array<string> }, enabledColumns: { [key: string]: Array<string> } },
    created_at: number,
    updated_at: number,
    cols: Array<string>,
    }
}) {
    const router = useRouter();
    const {lang} = useParams<{ lang: "en" | "es" }>();
    const { isLoading, stop, object, submit } = useObject({
        api: '/api/generate',
        headers: {
            'Content-Type': 'text/plain',
        },
        schema: tableGenerationSchema,
        onFinish: ({ object }) => {
            addToast({
                title: lang === "es" ? "Generación con IA" : "AI Schedule Generation",
                description: lang === "es" ? "¡Generación completada!" : "AI generation completed!",
                color: "success",            
            })
        },
        onError: () => addToast({
            title: lang === "es" ? "Generación con IA" : "AI Schedule Generation",
            description: lang === "es" ? "Hubo un error al generar el horario con IA. Inténtalo nuevamente y/o reporta este problema." : "An error has occurred while generating the schedule. Please try again and/or report the issue.",
            color: "danger",            
        })
    })    
    const { 
        table,
        controls,
        getTableStates,
        state,
        setter,
    } = useVirtualizedTable(isLoading, object, storedData);
    
    return (
        <>
        <div className="w-full md:w-5/6 justify-self-center grid grid-cols-[1fr_3fr_1fr] mb-10 px-5">
            <header className="col-start-1 col-end-1 flex flex-row justify-start items-center gap-5">
                <Button
                isIconOnly
                size="lg"
                aria-label="go back button"
                variant="light"
                onPress={() => router.back() }><ArrowCircleLeft width={32} height={32} /></Button>
            </header>
            <Input
            isClearable
            className="w-full"
            variant="underlined"
            size="lg"
            label={lang === "es" ? "Título" : "Title"}
            value={state.title}
            onValueChange={setter.setTitle}
            classNames={{
                input: "text-2xl",
                clearButton: "p-0 top-[65%]",
            }} />
        </div>

        <section className="w-full px-5 md:w-5/6 grid grid-rows-[auto_auto] grid-cols-[auto_1fr] justify-self-center my-15">
            <SessionProvider>
                <Settings 
                values={state.values} 
                setValues={setter.setValues} 
                setColumns={setter.setColumns}
                table={table}
                colSpecs={state.colSpecs}
                rowSpecs={state.rowSpecs}
                setColSpecs={setter.setColSpecs}
                setRowSpecs={setter.setRowSpecs}
                getTableStates={getTableStates}
                handleSubmit={submit} />
            </SessionProvider>
            <div className="col-start-2 col-span-1 flex flex-row justify-between gap-2">
                <div className="flex flex-row gap-2">
                    <Button 
                    isIconOnly
                    className="p-2"
                    size="lg"
                    variant="bordered" 
                    onPress={() => controls.handleDeleteColumn()}>
                        <ChevronDoubleLeft width={32} height={32} />
                    </Button>
                    <Button 
                    isIconOnly
                    className="p-2"
                    size="lg"
                    aria-label={lang === "es" ? "Añadir columna" : "Add column"} 
                    onPress={() => controls.handleAddColumn()}>
                        <ChevronDoubleRight width={32} height={32}/>
                    </Button>
                </div>

                <SaveButton states={getTableStates()} />
            </div>
            <div className="row-start-2 row-span-1 flex flex-col gap-2 items-end w-full pr-5 mt-5">
                <Button 
                isIconOnly
                className="p-2"
                size="lg"
                variant="bordered"
                aria-label={lang === "es" ? "Eliminar fila" : "Delete row"} 
                onPress={() => controls.handleDeleteRow()}>
                    <ChevronDoubleUp width={32} height={32} />
                </Button>
                <Button 
                isIconOnly
                className="p-2"
                size="lg"
                aria-label={lang === "es" ? "Añadir fila" : "Add row"}                 
                onPress={() => controls.handleAddRow()}>
                    <ChevronDoubleDown width={32} height={32} />
                </Button>
            </div>

            <table className="col-start-2 row-start-2 flex flex-col gap-3 py-5 overflow-x-scroll">
                <thead>
                    {
                        table.getHeaderGroups().map(headerGroup => {
                            return (
                                <tr key={headerGroup.id} className="flex flex-row justify-start gap-2 ml-[24px]">
                                    {
                                        headerGroup.headers.map(header => (
                                            <th key={header.id} colSpan={header.colSpan}>
                                                <div>
                                                    <div className="flex flex-row justify-center items-center gap-3 py-3">
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                        {
                                                            header.column.getCanSort()
                                                            ?   <button
                                                                className="w-fit p-0 cursor-pointer select-none" 
                                                                onClick={header.column.getToggleSortingHandler()} 
                                                                aria-label="Sort button">
                                                                <Sort />
                                                            </button>
                                                            : null
                                                        }
                                                        {{
                                                            asc: <SortAscending color="#71717a" />,
                                                            desc: <SortDescending color="#71717a" />,
                                                        }[header.column.getIsSorted() as string] ?? null}
                                                    </div>
                                                    {header.column.getCanFilter() 
                                                    ? <div>
                                                        <Filter column={header.column} />
                                                    </div>
                                                    : null}
                                                </div>
                                            </th>
                                        ))
                                    }
                                </tr>
                            )
                        })
                    }
                </thead>
                <tbody className="flex flex-col gap-3">
                {
                    table.getRowModel().rows.map(row => {
                        return <tr key={row.id} className="flex flex-row justify-start gap-2">
                            { 
                                row.getVisibleCells().map(col => {
                                    return <td key={col.id}>
                                        {flexRender(col.column.columnDef.cell, col.getContext())}
                                    </td>
                                })
                            }
                        </tr>
                    })
                }
                </tbody>
            </table>
        </section>        
        </>
    )
}