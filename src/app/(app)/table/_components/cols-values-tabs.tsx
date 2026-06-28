'use client'
import { HeaderType, TableState } from "@/lib/definitions";
import { Tab, TabList, TabPanel, Tabs } from "@react-spectrum/s2/Tabs";
import { useMemo } from "react";
import { generateCellId } from "@/lib/utils";
import ColCountSetting from "./col-count-setting";

export default function ColsValuesTabs({ rows, values, valuesInColumns, editCountInColumn }: {
    rows: TableState,
    values: Set<string>,
    valuesInColumns: Map<string, Map<string, number>>,
    editCountInColumn: (column: string, value: string, count: number) => void,
}) {
    const columnsHeaders = useMemo(() => rows && rows[0]
    ? rows[0].map((col, index) => {
        if (index === 0) {
            return;
        } else {
            return [generateCellId(0, index), col];
        }
    }).filter(element => element !== undefined)
    : [] , [rows]);

    return (
        <Tabs aria-label="Columns' values tabs">
            <TabList>
                {
                    columnsHeaders
                    ? columnsHeaders.map(([coordinate, header]) => {
                        return (
                            <Tab 
                            id={`${coordinate as string}`} 
                            key={`${coordinate as string}.tab`}
                            aria-label={`Setting for the column ${coordinate as string}`}>
                                { coordinate as string }
                            </Tab>
                        )
                    })
                    : null
                }
            </TabList>
            {
                columnsHeaders
                ? columnsHeaders.map(([coordinate, header]) => {
                    return (
                        <TabPanel id={`${coordinate as string}`} key={`${coordinate as string}.panel`}>
                            <h5 className="text-center text-2xl my-3">" { (header as HeaderType).value } "</h5>
                            { 
                                values
                                ? Array.from(values).map((value, index) => {
                                    return (
                                        <div 
                                        id={value} 
                                        key={`${value}.${index}`} 
                                        className="w-full flex flex-row justify-around py-2">
                                            <ColCountSetting
                                            valuesInColumns={valuesInColumns}
                                            value={value}
                                            column={coordinate as string}
                                            rowsLength={rows.length ?? 0}
                                            editCountInColumn={editCountInColumn} />
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