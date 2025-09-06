"use client"
import { Input } from "@heroui/react";
import { Column } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { memo, useEffect, useState } from "react";

const Filter = memo(function ({
    column,
}: {
    column: Column<any, any>,
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
            mainWrapper: "w-[63vw] h-[48px] sm:w-64"
        }}  
        value={value}
        onValueChange={setValue}
        placeholder={params.lang === "en" ? "Search..." : "Buscar..."}
        />
    )
});
export default Filter;