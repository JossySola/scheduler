'use client'
import useHardConstraints from "@/lib/custom-hooks/use-hard-constraints";
import useRows from "@/lib/custom-hooks/use-rows";
import useSoftConstraints from "@/lib/custom-hooks/use-soft-constraints";
import useValues from "@/lib/custom-hooks/use-table-values";
import { PanelInitialState } from "@/lib/definitions";
import Table from "./table";
import { Button } from "react-aria-components";
import HardConstraintsModal from "./hard-constraints-modal";
import SoftConstraintsModal from "./soft-constraints-modal";
import ValuesModal from "./values-modal";

export default function Panel({ initialState }: {
    initialState?: PanelInitialState,
}) {
    const {
        replaceRowsList,
        replaceColsList,
    } = useHardConstraints(initialState?.hardConstraints);
    const {
        addValue,
        deleteValue,
        editValue,
        replaceValues,
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
    const {
        valuesInColumns,
        valuesInRows,
        addColumnToMap,
        addRowToMap,
        editColumnNameInMap,
        editRowNameInMap,
        deleteColumnInMap,
        deleteRowInMap,
        addValueToColumn,
        addValueToRow,
        editCountInColumn,
        editCountInRow,
        deleteValueInColumn,
        deleteValueInRow,
    } = useSoftConstraints(initialState?.softConstraints);

    return (
        <main id="panel">
            <section id="settings">
                <HardConstraintsModal 
                rows={rows} 
                replaceColsList={replaceColsList} 
                replaceRowsList={replaceRowsList} />

                <SoftConstraintsModal 
                rows={rows} 
                values={values}
                controls={{
                    valuesInColumns,
                    valuesInRows,
                    addColumnToMap,
                    addRowToMap,
                    editColumnNameInMap,
                    editRowNameInMap,
                    deleteColumnInMap,
                    deleteRowInMap,
                    addValueToColumn,
                    addValueToRow,
                    editCountInColumn,
                    editCountInRow,
                    deleteValueInColumn,
                    deleteValueInRow,
                }} />

                <ValuesModal
                addValue={addValue}
                replaceValues={replaceValues}
                deleteValue={deleteValue}
                editValue={editValue}
                values={values} />
            </section>
            <section id="table">
                <Button type="button" onClick={() => addRow()}>Add Row</Button>
                <Button type="button" onClick={() => addCol()}>Add Column</Button>
                <Button type="button" onClick={() => deleteRow()}>Delete Row</Button>
                <Button type="button" onClick={() => deleteColumn()}>Delete Column</Button>
                <Table rows={rows} editCell={editCell} />
            </section>
        </main>
    )
}
