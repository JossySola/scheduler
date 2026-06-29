'use client'
import { TableState } from "@/lib/definitions";
import { generateCellId } from "@/lib/utils";
import { Tab, TabList, TabPanel, Tabs } from "@react-spectrum/s2/Tabs";
import { useMemo } from "react";
import RowCountSetting from "./row-count-setting";

export default function RowsValuesTabs({ rows, values, valuesInRows, editCountInRow }: {
    rows: TableState,
    values: Set<string>,
    valuesInRows: Map<string, Map<string, number>>,
    editCountInRow: (row: string, value: string, count: number) => void,
}) {
    const rowsHeaders = useMemo(() => rows && rows.length > 0
        ? rows.map((row, index) => {
            if (index === 0) {
                return;
            } else {
                const column = row[0];
                return [generateCellId(index, 0), column];
            }
        }).filter(element => element !== undefined)
        : []
    , [rows]);
    
    return (
        <Tabs aria-label="Rows' values tabs" orientation="vertical">
            <TabList>
                {
                    rowsHeaders
                    ? rowsHeaders.map(([coordinate, header], index) => {
                        // Create entry in the state map for each header, so they can be added in order
                        if (!valuesInRows.has(coordinate)) {
                            valuesInRows.set(coordinate, new Map([]));
                        }
                        return (
                            <Tab 
                            id={coordinate} 
                            key={`${coordinate}.${index}.tab`}
                            aria-label={`Setting for the row ${coordinate}`}>
                                { coordinate }
                            </Tab>
                        )
                    })
                    : null
                }
            </TabList>
            {
                rowsHeaders
                ? rowsHeaders.map(([coordinate, header]) => {
                    return (
                        <TabPanel id={`${coordinate}`} key={`${coordinate}.panel`}>
                            <h5 className="text-center text-2xl my-3">" { header } "</h5>
                            {
                                values
                                ? Array.from(values).map((value, index) => {
                                    return (
                                        <div
                                        id={value}
                                        key={`${value}.${index}`}
                                        className="w-full flex flex-row justify-around py-2">
                                            <RowCountSetting
                                            value={value}
                                            row={coordinate as string}
                                            colsLength={rows && rows.length > 0 ? rows[0].length -1 : 0}
                                            valuesInRows={valuesInRows}
                                            editCountInRow={editCountInRow} />
                                        </div>
                                    )
                                })
                                : null
                            }
                        </TabPanel>
                    )
                })
                : null
            }
        </Tabs>
    )
}