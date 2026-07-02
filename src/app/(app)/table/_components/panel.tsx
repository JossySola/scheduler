'use client'
import useHardConstraints from "@/lib/custom-hooks/constraints/use-hard-constraints";
import useRows from "@/lib/custom-hooks/use-rows";
import useSoftConstraints from "@/lib/custom-hooks/constraints/use-soft-constraints";
import useValues from "@/lib/custom-hooks/constraints/use-table-values";
import { PanelInitialState } from "@/lib/definitions";
import Table from "./table";
import { Button } from "react-aria-components";
import HardConstraintsModal from "./hard/hard-constraints-modal";
import SoftConstraintsModal from "./soft/soft-constraints-modal";
import ValuesModal from "./values/values-modal";
import useHeaderType from "@/lib/custom-hooks/constraints/use-header-type";
import useStructuralConstraints from "@/lib/custom-hooks/constraints/use-structural-constraints";
import HeaderTypesModal from "./header-types/header-types-modal";
import StructuralConstraintsModal from "./structural/structural-constraints-modal";

export default function Panel({ initialState }: {
    initialState?: PanelInitialState,
}) {
    const {
        disabledRows,
        disabledColumns,
        setRowsList,
        setColsList,
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
        setColumnSpec,
        setRowSpec,
        deleteRowFromStructuralMap,
        deleteColumnFromStructuralMap,
        columnsSpecificity,
        rowsSpecificity,
    } = useStructuralConstraints(initialState?.structuralConstraints);

    return (
        <main id="panel">
            <section id="constraints-settings" aria-label="Constraints Settings">
                <HardConstraintsModal 
                rows={rows} 
                setColsList={setColsList} 
                setRowsList={setRowsList} />

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

                <StructuralConstraintsModal 
                rows={rows} 
                setColumnSpec={setColumnSpec} 
                setRowSpec={setRowSpec} 
                columnsSpecificity={columnsSpecificity} 
                rowsSpecificity={rowsSpecificity} />

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
                    deleteRowFromStructuralMap();
                }}>Delete Row</Button>
                <Button type="button" onClick={() => {
                    deleteColumnInMap();
                    deleteColumn();
                    deleteColumnFromStructuralMap();
                }}>Delete Column</Button>

                <Table 
                rows={rows} 
                rowHeadersType={rowsType}
                colHeadersType={colsType}
                editCell={editCell} />
            </section>
            <section className="flex flex-col gap-5">
                <section>
                    <h3>Hard Constraints</h3>
                    <p>disabledRows</p>
                    <ul>
                        {
                            Array.from(disabledRows).map(item => <li key={item}>{item}</li>)
                        }
                    </ul>
                    <p>disabledColumns</p>
                    <ul>
                        {
                            Array.from(disabledColumns).map(item => <li key={item}>{item}</li>)
                        }
                    </ul>
                </section>
                <section>
                    <h3>Soft Constraints</h3>
                    <p>valuesInColumns</p>
                    <ul>
                        {
                            Array.from(valuesInColumns).map(([item, map]) => (
                                <li key={item}>
                                    {item} 
                                    <ul>
                                    {
                                        Array.from(map).map(([item, count]) => <li key={item}>{`${item}: ${count}`}</li>)
                                    }
                                    </ul>
                                </li>
                            ))
                        }
                    </ul>
                    <p>valuesInRows</p>
                    <ul>
                        {
                            Array.from(valuesInRows).map(([item, map]) => (
                                <li key={item}>
                                    {item}
                                    <ul>
                                    {
                                        Array.from(map).map(([item, count]) => <li key={item}>{`${item}: ${count}`}</li>)
                                    }
                                    </ul>
                                </li>
                            ))
                        }
                    </ul>
                </section>
                <section>
                    <h3>Values</h3>
                    <ul>
                        {
                            Array.from(values).map(item => <li key={item}>{item}</li>)
                        }
                    </ul>
                </section>
                <section>
                    <h3>Structural Constraints</h3>
                    <p>columnsSpecificity</p>
                    <ul>
                    {
                        Array.from(columnsSpecificity).map(([item, set]) => (
                            <li key={item}>
                                {item}
                                <ul>
                                    {
                                        Array.from(set).map(item => <li key={item}>{item}</li>)
                                    }
                                </ul>
                            </li>
                        ))
                    }
                    </ul>
                    <p>rowsSpecificity</p>
                    <ul>
                    {
                        Array.from(rowsSpecificity).map(([item, set]) => (
                            <li key={item}>
                                {item}
                                <ul>
                                    {
                                        Array.from(set).map(item => <li key={item}>{item}</li>)
                                    }
                                </ul>
                            </li>
                        ))
                    }
                    </ul>
                </section>
            </section>
        </main>
    )
}
