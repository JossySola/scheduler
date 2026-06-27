'use client'
import { TableState } from "@/lib/definitions";
import ColsValuesTabs from "./cols-values-tabs";
import { Button, Content, Dialog, DialogTrigger, Heading } from "@react-spectrum/s2/Dialog";

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
                                <h4 id="setting-description">The amount of times the value can be used in each column</h4>
                                <ColsValuesTabs 
                                rows={rows} 
                                values={values}
                                valuesInColumns={controls.valuesInColumns} />
                            </Content>
                        </>
                    )
                }
            </Dialog>
        </DialogTrigger>
    )
}
