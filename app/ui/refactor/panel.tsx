"use client"
import Table from "./table"
import Specs from "./specs"
import { useParams } from "next/navigation"
import { TableContext } from "@/app/[lang]/table/context";
import { Table as TableClass } from "@/app/lib/utils-client";
import { useCallback, useState } from "react";
import { Button } from "@heroui/react";

export default function Panel ({ storedTable }: { storedTable?: TableClass }) {
    const params = useParams<{ lang: "en" | "es" }>();
    const [_v, setVersion] = useState<number>(0);
    const [tableInstance, _t] = useState<TableClass>(new TableClass(storedTable && storedTable.title, storedTable && storedTable.rows));

    const updateTable = useCallback((mutatorFn: () => void) => {
        mutatorFn();
        setVersion(v => v + 0.5);
    }, [tableInstance]);

    return (
        <section>
            <h1>Panel</h1>
            <Button onPress={() => updateTable(() => tableInstance.addColumn())}>
                {
                    params.lang === "es" ? "" : "Add column"
                }
            </Button>
            <Button onPress={() => updateTable(() => tableInstance.removeColumn(tableInstance.size - 1))}>
                {
                    params.lang === "es" ? "" : "Delete column"
                }
            </Button>
            <Button onPress={() => updateTable(() => tableInstance.addRow())}>
                {
                    params.lang === "es" ? "" : "Add row"
                }
            </Button>
            <Button onPress={() => updateTable(() => tableInstance.removeRow())}>
                {
                    params.lang === "es" ? "" : "Delete row"
                }
            </Button>
            <TableContext value={{ table: tableInstance , setVersion }}>
                <Table />
                <Specs />
            </TableContext>
        </section>
    )
}