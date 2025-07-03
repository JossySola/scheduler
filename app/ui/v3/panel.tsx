"use client"
import Table from "./table";
import { TableContext } from "@/app/[lang]/table/context";
import { useRef } from "react";
import ColumnsActions from "./col-actions";
import RowsActions from "./rows-actions";
import TableSettings from "./table-settings";
import { RowType, TableExtended } from "@/app/lib/utils-client";
import { useForcePanelUpdate } from "@/app/hooks/custom";
import { useParams, useRouter } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { ArrowCircleLeft } from "../icons";

export default function Panel ({ name, stored_rows, stored_values, stored_type, stored_interval }: {
        name? : string,
        stored_rows?: Array<Map<string, RowType>>,
        stored_values?: Array<string>,
        stored_type?: "text" | "date" | "time",
        stored_interval?: number,
}) {
    const router = useRouter();
    const { lang } = useParams<{ lang: "es" | "en" }>();
    const table = useRef<TableExtended>(new TableExtended(
        name ? name : lang === "es" ? "Sin título" : "No title",
        stored_rows && stored_rows,
        stored_values && new Set(stored_values),
        stored_type && stored_type,
        stored_interval && stored_interval,
    ));
    const panelUpdate = useForcePanelUpdate();
    const handleNameChange = (name: string) => {
        table.current.name = name;
    }
    return (
        <TableContext.Provider value={{ table: table.current, panelUpdate }}>
            <div className="grid grid-cols-[1fr_85vw_1fr] mb-10">
                <header className="col-start-2 col-end-2 flex flex-row justify-start items-center gap-5">
                    <Button isIconOnly 
                    size="lg"
                    aria-label="go back button" 
                    variant="light"
                    onPress={() => router.back()}>
                        <ArrowCircleLeft width={32} height={32} />
                    </Button>
                    
                    <Input isClearable
                    className="w-full sm:w-1/2" 
                    variant="underlined" 
                    size="lg" 
                    label={ lang === "es" ? "Título" : "Title" }
                    defaultValue={ table.current.name }
                    onValueChange={ handleNameChange }
                    classNames={{
                        input: "text-2xl",
                        clearButton: "p-0 top-[65%]"
                    }} />
                </header>
            </div>
            
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
                    table.current.rows && table.current.rows.map((map, index) => <p key={index}>{JSON.stringify(Object.fromEntries(map))}<br></br><br></br></p>)
                }
                </section>
            </section>
        </TableContext.Provider>
    )
}