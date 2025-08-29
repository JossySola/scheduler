"use client"
import { useVirtualizedTable } from "@/app/hooks/custom";
import { Button } from "@heroui/react";
import { flexRender } from "@tanstack/react-table";
import Filter from "./filter";

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
        <table>
            <thead>
                {
                    table.getHeaderGroups().map(headerGroup => {
                        return (
                            <tr key={headerGroup.id}>
                                {
                                    headerGroup.headers.map(header => (
                                        <th key={header.id} colSpan={header.colSpan}>
                                            <div>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
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
            <tbody>
            {
                table.getRowModel().rows.map((row, rowIndex) => {
                    return <tr key={row.id}>
                        { 
                            row.getVisibleCells().map((cell, colIndex) => {
                                return <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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