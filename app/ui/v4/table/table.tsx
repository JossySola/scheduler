"use client"
import { useVirtualizedTable } from "@/app/hooks/custom";
import { Button } from "@heroui/react";
import { flexRender } from "@tanstack/react-table";
import Filter from "./filter";
import { Sort, SortAscending, SortDescending } from "../../icons";

export default function Table() {
    const { 
        table,
        setData,
        handleAddColumn, 
        handleAddRow, 
        handleDeleteColumn, 
        handleDeleteRow 
    } = useVirtualizedTable();

    return (
        <>
        <Button onPress={() => handleAddColumn()}>Add Column</Button>
        <Button onPress={() => handleAddRow()}>Add Row</Button>
        <Button onPress={() => handleDeleteColumn()}>Delete Column</Button>
        <Button onPress={() => handleDeleteRow()}>Delete Row</Button>
        <table className="flex flex-col gap-3 py-5 overflow-x-scroll">
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
                                                        ? <button className="cursor-pointer" onClick={header.column.getToggleSortingHandler()} aria-label="Sort button">
                                                            <Sort />
                                                        </button>
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
        </>
    )
}