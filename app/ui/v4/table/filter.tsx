"use client"
import { Input } from "@heroui/react";
import { Column, Table } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { memo } from "react";

const Filter = memo(function ({
    column,
    table,
}: {
    column: Column<any, any>,
    table: Table<any>
}) {
    const params = useParams<{ lang: "en" | "es" }>();
    const columnFilterValue = column.getFilterValue();

    return (
        <Input
        type="text"
        variant="faded"
        classNames={{
            input: "w-[50vw] text-base sm:w-[204px]",
        }}        
        value={(columnFilterValue ?? '') as string}
        onValueChange={e => column.setFilterValue(e)}
        placeholder={params.lang === "en" ? "Search..." : "Buscar..."}
        />
    )
});
export default Filter;