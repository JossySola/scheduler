"use client"
import Table from "./table";
import { useParams } from "next/navigation";
import { TableContext } from "@/app/[lang]/table/context";
import { useState } from "react";
import ColumnsActions from "./columns-actions";
import RowsActions from "./rows-actions";
import TableSettings from "./table-settings";
import { DynamicTable } from "@/app/lib/utils-client";

export default function Panel ({ 
    title, stored_rows, stored_values, stored_row_specs, stored_col_specs }: { 
        title?: string,
        stored_rows?: Array<Map<any, any>>,
        stored_values?: Array<string>,
        stored_row_specs?: Array<Map<any, any>>,
        stored_col_specs?: Array<Map<any, any>>, 
    }) {
    const params = useParams<{ lang: "en" | "es" }>();
    const [_v, setVersion] = useState<number>(0);
    const [tableInstance, _t] = useState<DynamicTable>(new DynamicTable(
        title ? title : (params.lang === "es" ? "Sin título" : "Untitled table"), 
        stored_rows && stored_rows,
        stored_values && stored_values,
        stored_row_specs && stored_row_specs,
        stored_col_specs && stored_col_specs,
    ));

    return (
        <TableContext.Provider value={{ table: tableInstance, setVersion }}>
            <section className="grid grid-rows-[auto_auto] grid-cols-[auto_auto]">
                <TableSettings />
                <ColumnsActions setVersion={setVersion} tableInstance={tableInstance} />
                <RowsActions setVersion={setVersion} tableInstance={tableInstance} />
                <Table />
            </section>
        </TableContext.Provider>
    )
}