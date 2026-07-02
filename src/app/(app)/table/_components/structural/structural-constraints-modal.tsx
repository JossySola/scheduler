'use client'
import { TableState } from "@/lib/definitions";
import { Button, Content, Dialog, DialogTrigger, Heading } from "@react-spectrum/s2/Dialog";
import ColsTabs from "./cols-tabs";
import RowsTabs from "./rows-tabs";
import { Divider } from "@react-spectrum/s2/Divider";

export default function StructuralConstraintsModal({ rows, setColumnSpec, setRowSpec, columnsSpecificity, rowsSpecificity }: {
    rows: TableState,
    setColumnSpec: (column: string, newArray: Array<string>) => void,
    setRowSpec: (row: string, newArray: Array<string>) => void,
    columnsSpecificity: Map<string, Set<string>>,
    rowsSpecificity: Map<string, Set<string>>,
}) {
    // <In X column> fill Y rows
    // <In Y row> fill X columns
    return (
        <DialogTrigger>
            <Button variant="primary">Structural Constraints</Button>
            <Dialog isDismissible={true} isKeyboardDismissDisabled={true}>
                {
                    () => (
                        <>
                            <Heading slot="title">Structural Constraints</Heading>
                            <Content>
                                <section className="flex flex-col gap-4">
                                    <section>
                                        <h4>Columns</h4>
                                        {
                                            rows && rows[0] && rows[0].length > 0
                                            ? <ColsTabs rows={rows} setColumnSpec={setColumnSpec} columnsSpecificity={columnsSpecificity} />
                                            : <p className="text-center"><i>No columns yet</i></p>
                                        }
                                    </section>
                                    <Divider />
                                    <section>
                                        <h4>Rows</h4>
                                        {
                                            rows && rows.length > 0
                                            ? <RowsTabs rows={rows} setRowSpec={setRowSpec} rowsSpecificity={rowsSpecificity} />
                                            : <p className="text-center"><i>No rows yet</i></p>
                                        }
                                    </section>
                                </section>
                            </Content>
                        </>
                    )
                }
            </Dialog>
        </DialogTrigger>
    )
}