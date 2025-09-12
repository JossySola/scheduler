"use client"
import { useVirtualizedTable } from "@/app/hooks/custom";
import { Button } from "@heroui/react";
import { flexRender } from "@tanstack/react-table";
import Filter from "../input/filter";
import { ChevronDoubleDown, ChevronDoubleLeft, ChevronDoubleRight, ChevronDoubleUp, Sort, SortAscending, SortDescending } from "../../icons";
import { useParams } from "next/navigation";
import Settings from "../drawer/settings";
import { useEffect } from "react";

export default function Table() {
    const params = useParams<{ lang: "en" | "es" }>();
    const { 
        table,
        setData,
        controls,
        state,
        setter,
    } = useVirtualizedTable();
    useEffect(() => {
        //console.log(state.headerType)
    }, [state.headerType]);
    return (
        <section className="w-full px-5 md:w-5/6 grid grid-rows-[auto_auto] grid-cols-[auto_1fr] justify-self-center my-15">
            <Settings values={state.values} setValues={setter.setValues} setColumns={setter.setColumns} />
            <div className="col-start-2 col-span-1 flex flex-row gap-2">
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
                aria-label={params.lang === "es" ? "Añadir columna" : "Add column"} 
                onPress={() => controls.handleAddColumn()}>
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
                onPress={() => controls.handleDeleteRow()}>
                    <ChevronDoubleUp width={32} height={32} />
                </Button>
                <Button 
                isIconOnly
                className="p-2"
                size="lg"
                aria-label={params.lang === "es" ? "Añadir fila" : "Add row"}                 
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
    )
}