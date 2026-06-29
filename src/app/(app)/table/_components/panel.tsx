'use client'
import useHardConstraints from "@/lib/custom-hooks/constraints/use-hard-constraints";
import useRows from "@/lib/custom-hooks/use-rows";
import useSoftConstraints from "@/lib/custom-hooks/constraints/use-soft-constraints";
import useValues from "@/lib/custom-hooks/constraints/use-table-values";
import { PanelInitialState } from "@/lib/definitions";
import Table from "./table";
import { Button } from "react-aria-components";
import HardConstraintsModal from "./hard-constraints-modal";
import SoftConstraintsModal from "./soft-constraints-modal";
import ValuesModal from "./values-modal";
import useHeaderType from "@/lib/custom-hooks/constraints/use-header-type";
import useStructuralConstraints from "@/lib/custom-hooks/constraints/use-structural-constraints";
import HeaderTypesModal from "./header-types-modal";

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
    const {
        rowsType,
        colsType,
        changeColsType,
        changeRowsType,
    } = useHeaderType(initialState?.headersType);
    const {
        addColumnSpec,
        addRowSpec,
        deleteColumnSpec,
        deleteRowSpec,
        columnsSpecificity,
        rowsSpecificity,
    } = useStructuralConstraints(initialState?.structuralConstraints);

    return (
        <main id="panel">
            <section id="constraints-settings" aria-label="Constraints Settings">
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

                <HeaderTypesModal
                rowsType={rowsType}
                colsType={colsType}
                changeColsType={changeColsType}
                changeRowsType={changeRowsType} />

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
                <Button type="button" onClick={() => {
                    deleteRowInMap();
                    deleteRow();
                }}>Delete Row</Button>
                <Button type="button" onClick={() => {
                    deleteColumnInMap();
                    deleteColumn();
                }}>Delete Column</Button>

                <Table 
                rows={rows} 
                rowHeadersType={rowsType}
                colHeadersType={colsType}
                editCell={editCell} />
            </section>
        </main>
    )
}
