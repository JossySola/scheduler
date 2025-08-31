"use client"
import { Input } from "@heroui/react";
import { Column, Table } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { memo, useEffect, useState } from "react";

const Filter = memo(function ({
    column,
    table,
}: {
    column: Column<any, any>,
    table: Table<any>
}) {
    const columnFilterValue = column.getFilterValue();
    const [value, setValue] = useState<string>((columnFilterValue ?? '') as string);
    const params = useParams<{ lang: "en" | "es" }>();
    useEffect(() => {
        column.setFilterValue(value);
    }, [value]);
    return (
        <Input
        type="text"
        variant="faded"
        classNames={{
            input: "w-[50vw] text-base sm:w-[204px]",
        }}        
        value={value}
        onValueChange={setValue}
        placeholder={params.lang === "en" ? "Search..." : "Buscar..."}
        />
    )
});
export default Filter;