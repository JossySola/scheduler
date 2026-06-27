'use client'
import { HeaderType, TableState } from "@/lib/definitions";
import { Tab, TabList, TabPanel, Tabs } from "@react-spectrum/s2/Tabs";
import { NumberField } from "@react-spectrum/s2/NumberField";
import { useMemo } from "react";
import { generateCellId } from "@/lib/utils";

export default function ColsValuesTabs({ rows, values, valuesInColumns }: {
    rows: TableState,
    values: Set<string>,
    valuesInColumns: Map<string, Map<string, number>>,
}) {
    const columnsHeaders = useMemo(() => rows && rows[0]
    ? rows[0].map((col, index) => [generateCellId(0, index), col])
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
                                            <span className="w-1/5 text-2xl text-center truncate">{ value }</span>
                                            <NumberField
                                            aria-labelledby="setting-description" 
                                            minValue={0} 
                                            maxValue={columnsHeaders.length ?? 1} />
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