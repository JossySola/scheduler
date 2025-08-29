"use client"
import { useVirtualizedTable } from "@/app/hooks/custom";
import { Button } from "@heroui/react";
import { flexRender } from "@tanstack/react-table";
import Filter from "./filter";

type RowHeader = {
    value: string,
    disable: boolean,
    count: number,
    enabledValues: Array<string>,
    enabledColumns: Array<string>,
}
type ColHeader = {
    value: string,
    numberOfRows: number,
    amountOfValues: Array<number>,
}
type Data = {
    value: string,
}
type Cell = RowHeader | ColHeader | Data;
type TData = {
    [index: string]: string,
    value: string,
}
type TestData = {
    firstName: string,
    lastName: string,
    age: number,
    visits: number,
    progress: number,
    status: string
}
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