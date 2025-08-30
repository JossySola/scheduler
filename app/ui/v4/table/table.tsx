"use client"
import { useVirtualizedTable } from "@/app/hooks/custom";
import { Button } from "@heroui/react";
import { flexRender } from "@tanstack/react-table";
import Filter from "./filter";
import { ChevronDoubleDown, ChevronDoubleLeft, ChevronDoubleRight, ChevronDoubleUp, Sort, SortAscending, SortDescending } from "../../icons";
import { useParams } from "next/navigation";
import Settings from "./settings";
import { useState } from "react";

export default function Table() {
    const params = useParams<{ lang: "en" | "es" }>();
    const [ values, setValues ] = useState<Set<string>>(new Set());    
    const { 
        table,
        setData,
        handleAddColumn, 
        handleAddRow, 
        handleDeleteColumn, 
        handleDeleteRow 
    } = useVirtualizedTable(values);

    return (
        <section className="w-5/6 grid grid-rows-[auto_auto] grid-cols-[auto_1fr] justify-self-center my-15">
            <Settings values={values} setValues={setValues} />
            <div className="col-start-2 col-span-1 flex flex-row gap-2">
                <Button 
                isIconOnly
                className="p-2"
                size="lg"
                variant="bordered" 
                onPress={() => handleDeleteColumn()}>
                    <ChevronDoubleLeft width={32} height={32} />
                </Button>
                <Button 
                isIconOnly
                className="p-2"
                size="lg"
                aria-label={params.lang === "es" ? "Añadir columna" : "Add column"} 
                onPress={() => handleAddColumn()}>
                    <ChevronDoubleRight width={32} height={32}/>
                </Button>
            </div>
            <div className="row-start-2 row-span-1 flex flex-col gap-2 items-end w-full pr-5 mt-5">
                <Button 
                isIconOnly
                className="p-2"
                size="lg"
                variant="bordered"
                aria-label={params.lang === "es" ? "Eliminar fila" : "Delete row"} 
                onPress={() => handleDeleteRow()}>
                    <ChevronDoubleUp width={32} height={32} />
                </Button>
                <Button 
                isIconOnly
                className="p-2"
                size="lg"
                aria-label={params.lang === "es" ? "Añadir fila" : "Add row"}                 
                onPress={() => handleAddRow()}>
                    <ChevronDoubleDown width={32} height={32} />
                </Button>
            </div>

            <table className="col-start-2 row-start-2 flex flex-col gap-3 py-5 overflow-x-scroll">
                <thead>
                    {
                        table.getHeaderGroups().map(headerGroup => {
                            return (
                                <tr key={headerGroup.id} className="flex flex-row gap-3 ml-[1.5rem]">
                                    {
                                        headerGroup.headers.map(header => (
                                            <th key={header.id} colSpan={header.colSpan}>
                                                <div>
                                                    <div className="flex flex-row justify-center items-center gap-3">
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                        {
                                                            header.column.getCanSort()
                                                            ?   <Button 
                                                                variant="light" 
                                                                className="w-fit p-0" 
                                                                onPress={() => header.column.getToggleSortingHandler()} 
                                                                aria-label="Sort button">
                                                                <Sort />
                                                            </Button>
                                                            : null
                                                        }
                                                        {{
                                                            asc: <SortAscending />,
                                                            desc: <SortDescending />,
                                                        }[header.column.getIsSorted() as string] ?? null}
                                                    </div>
                                                    {header.column.getCanFilter() 
                                                    ? <div>
                                                        <Filter column={header.column} table={table} />
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
                        return <tr key={row.id} className="flex flex-row gap-3">
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
    )
}