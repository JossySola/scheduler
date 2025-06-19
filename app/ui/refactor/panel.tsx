"use client"
import Table from "./table";
import { TableContext } from "@/app/[lang]/table/context";
import { useState } from "react";
import ColumnsActions from "./col-actions";
import RowsActions from "./rows-actions";
import TableSettings from "./table-settings";
import { RowType, TableExtended } from "@/app/lib/utils-client";

export default function Panel ({ 
    stored_rows, stored_values }: {
        stored_rows?: Array<Map<string, RowType>>,
        stored_values?: Array<string>,
    }) {
    const [_p, setPanelRender] = useState<number>(0);
    const [tableInstance, _t] = useState<TableExtended>(new TableExtended(
        stored_rows && stored_rows,
        stored_values && stored_values,
    ));

    return (
        <TableContext.Provider value={{ table: tableInstance, setPanelRender }}>
            <section className="grid grid-rows-[auto_auto] grid-cols-[auto_auto]">
                <TableSettings />
                <ColumnsActions />
                <RowsActions />
                <Table />
                
            </section>
            <section className="flex flex-col">
                <section className="m-5">
                <h2>Rows</h2>
                {
                    tableInstance.rows && tableInstance.rows.map((map, index) => <p key={index}>{JSON.stringify(Object.fromEntries(map))}<br></br><br></br></p>)
                }
                </section>
            </section>
        </TableContext.Provider>
    )
}