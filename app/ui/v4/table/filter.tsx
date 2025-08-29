"use client"
import { Input } from "@heroui/react";
import { Column, Table } from "@tanstack/react-table";

export default function Filter({
    column,
    table,
}: {
    column: Column<any, any>,
    table: Table<any>
}) {
    const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
    const columnFilterValue = column.getFilterValue();

    return (
        <Input
        type="text"
        value={(columnFilterValue ?? '') as string}
        onValueChange={e => column.setFilterValue(e)}
        placeholder={`Search...`}
        />
    )
}