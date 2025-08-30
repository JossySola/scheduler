"use client"
import { Input } from "@heroui/react";
import { Column, Table } from "@tanstack/react-table";
import { useParams } from "next/navigation";

export default function Filter({
    column,
    table,
}: {
    column: Column<any, any>,
    table: Table<any>
}) {
    const params = useParams<{ lang: "en" | "es" }>();
    const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
    const columnFilterValue = column.getFilterValue();

    return (
        <Input
        type="text"
        variant="faded"
        value={(columnFilterValue ?? '') as string}
        onValueChange={e => column.setFilterValue(e)}
        placeholder={params.lang === "en" ? "Search..." : "Buscar..."}
        />
    )
}