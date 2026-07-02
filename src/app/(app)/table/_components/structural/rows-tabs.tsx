'use client'
import { TableState } from "@/lib/definitions";
import { generateCellId } from "@/lib/utils";
import { Tab, TabList, TabPanel, Tabs } from "@react-spectrum/s2/Tabs";
import { useMemo } from "react";
import RowsCheckboxGroup from "./rows-checkbox-group";

export default function RowsTabs({ rows, setRowSpec, rowsSpecificity }: {
    rows: TableState,
    setRowSpec: (row: string, newArray: Array<string>) => void,
    rowsSpecificity: Map<string, Set<string>>,
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
        <Tabs orientation="vertical" aria-label="Column checkbox group to specify which column must be filled">
            <TabList>
            {
                rowHeaders
                ? rowHeaders.map(([coordinate, header]) => {
                    return (
                        <Tab id={coordinate} key={`${coordinate}.tab`} aria-label={`Checkbox group for row ${coordinate}`}>
                            { coordinate }
                        </Tab>
                    )
                })
                : null
            }
            </TabList>
            {
                rowHeaders
                ? rowHeaders.map(([coordinate, header]) => {
                    const previousState = rowsSpecificity.get(coordinate);
                    return (
                        <TabPanel id={coordinate} key={`${coordinate}.panel`}>
                            <h5>" { header } "</h5>
                            <RowsCheckboxGroup previousState={previousState} row={coordinate} colHeaders={columnHeaders} setRowSpec={setRowSpec}  />
                        </TabPanel>
                    )
                })
                : null
            }
        </Tabs>
    )
}