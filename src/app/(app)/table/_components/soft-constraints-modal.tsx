'use client'
import { TableState } from "@/lib/definitions";
import ColsValuesTabs from "./cols-values-tabs";
import { Button, Content, Dialog, DialogTrigger, Heading } from "@react-spectrum/s2/Dialog";
import RowsValuesTabs from "./rows-values-tabs";
import {Divider} from '@react-spectrum/s2/Divider';

export default function SoftConstraintsModal({ rows, values, controls }: {
    rows: TableState,
    values: Set<string>,
    controls: {
        valuesInColumns: Map<string, Map<string, number>>,
        valuesInRows: Map<string, Map<string, number>>,
        addColumnToMap: (column: string) => void,
        addRowToMap: (row: string) => void,
        editColumnNameInMap: (previousName: string, newName: string) => void,
        editRowNameInMap: (previousName: string, newName: string) => void,
        deleteColumnInMap: (column: string) => void,
        deleteRowInMap: (row: string) => void,
        addValueToColumn: (column: string, value: string, count: number) => void,
        addValueToRow: (row: string, value: string, count: number) => void,
        editCountInColumn: (column: string, value: string, count: number) => void,
        editCountInRow: (row: string, value: string, count: number) => void,
        deleteValueInColumn: (column: string, value: string) => void,
        deleteValueInRow: (row: string, value: string) => void,
    }
}) {
    return (
        <DialogTrigger>
            <Button variant="primary">Soft Constraints</Button>
            <Dialog isDismissible={true} isKeyboardDismissDisabled={true}>
                {
                    () => (
                        <>
                            <Heading slot="title">Soft Constraints</Heading>
                            <Content>
                                <section className="w-full my-4">
                                    <p id="col-setting-description" className="text-xl mb-3">The amount of times the value can be used in each <b>column</b></p>
                                    {
                                        rows && rows.length > 0
                                        ? <ColsValuesTabs 
                                            rows={rows} 
                                            values={values}
                                            valuesInColumns={controls.valuesInColumns}
                                            editCountInColumn={controls.editCountInColumn} />
                                    : <p className="text-center"><i>No columns yet</i></p>
                                    }
                                </section>

                                <Divider />

                                <section className="w-full my-4">
                                    <p id="row-setting-description" className="text-xl mb-3">The amount of times the value can be used in each <b>row</b></p>
                                    {
                                        rows && rows.length > 0
                                        ? <RowsValuesTabs
                                            rows={rows}
                                            values={values}
                                            valuesInRows={controls.valuesInRows}
                                            editCountInRow={controls.editCountInRow} />
                                        : <p className="text-center"><i>No rows yet.</i></p>
                                    }
                                </section>
                            </Content>
                        </>
                    )
                }
            </Dialog>
        </DialogTrigger>
    )
}
