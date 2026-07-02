'use client'
import { TableState } from "@/lib/definitions";
import { generateCellId } from "@/lib/utils";
import { Tab, TabList, TabPanel, Tabs } from "@react-spectrum/s2/Tabs";
import { useMemo } from "react";
import ColsCheckboxGroup from "./cols-checkbox-group";

export default function ColsTabs({ rows, setColumnSpec, columnsSpecificity }: {
    rows: TableState,
    setColumnSpec: (column: string, newArray: Array<string>) => void,
    columnsSpecificity: Map<string, Set<string>>,
}) {

    const columnHeaders = useMemo(() => rows && rows[0]
    ? rows[0].map((col, index) => {
        if (index === 0) {
            return;
        } else {
            return [generateCellId(0, index), col];
        }
    }).filter(element => element !== undefined)
    : [], [rows]);
    const rowHeaders = useMemo(() => rows && rows.length > 0
    ? rows.map((row, index) => {
        if (row[0] && index !== 0) {
            return [generateCellId(index, 0), row[0]];
        } else {
            return;
        }
    }).filter(element => element !== undefined)
    : [], [rows]);

    return (
        <Tabs aria-label="Rows checkbox group to specify which row must be filled">
            <TabList>
            {
                columnHeaders
                ? columnHeaders.map(([coordinate, header]) => {
                    return (
                        <Tab id={coordinate} key={`${coordinate}.tab`} aria-label={`Checkbox group for column ${coordinate}`}>
                            { coordinate }
                        </Tab>
                    )
                })
                : null
            }
            </TabList>
            {
                columnHeaders
                ? columnHeaders.map(([coordinate, header]) => {
                    const previousState = columnsSpecificity.get(coordinate);
                    return (
                        <TabPanel id={coordinate} key={`${coordinate}.panel`}>
                            <h5>" { header } "</h5>
                            <ColsCheckboxGroup previousState={previousState} column={coordinate} rowHeaders={rowHeaders} setColumnSpec={setColumnSpec} />
                        </TabPanel>
                    )
                })
                : null
            }
        </Tabs>
    )
}