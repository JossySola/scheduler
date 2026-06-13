'use client'
import useHardConstraints from "@/lib/custom-hooks/use-hard-constraints";
import useRows from "@/lib/custom-hooks/use-rows";
import useSoftConstraints from "@/lib/custom-hooks/use-soft-constraints";
import useValues from "@/lib/custom-hooks/use-table-values";
import { PanelInitialState } from "@/lib/definitions";
import Table from "./table";
import { Button } from "react-aria-components";

export default function Panel({ initialState }: {
    initialState?: PanelInitialState,
}) {
    const {
        disableRow,
        disableColumn,
        enableRow,
        enableColumn,
        disabledRows,
        disabledColumns,
    } = useHardConstraints(initialState?.hardConstraints);
    const {
        valuesInColumn,
        valuesInRow,
        addValueInColumn,
        addValueInRow,
        editCountInColumn,
        editValueInRow,
        deleteCountInColumn,
        deleteValueInRow,
    } = useSoftConstraints(initialState?.softConstraints);
    const {
        addValue,
        deleteValue,
        editValue,
        values,
    } = useValues(initialState?.values);
    const {
        rows,
        addRow,
        addCol,
        deleteRow,
        deleteColumn,
        editCell,
    } = useRows(initialState?.rows);
    return (
        <section>
            <Button type="button" onClick={() => addRow()}>Add Row</Button>
            <Button type="button" onClick={() => addCol()}>Add Column</Button>
            <Button type="button" onClick={() => deleteRow()}>Delete Row</Button>
            <Button type="button" onClick={() => deleteColumn()}>Delete Column</Button>
            <Table rows={rows} editCell={editCell} />
        </section>
    )
}