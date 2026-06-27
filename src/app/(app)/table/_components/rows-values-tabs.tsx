'use client'
import { TableState } from "@/lib/definitions";
import { ListView, ListViewItem } from "@react-spectrum/s2/ListView";
import { NumberField } from "@react-spectrum/s2/NumberField";
import { Tab, TabList, TabPanel, Tabs } from "@react-spectrum/s2/Tabs";
import { useMemo } from "react";

export default function RowsValuesTabs({ rows, values }: {
    rows: TableState,
    values: Set<string>,
}) {
    const rowsHeaders = useMemo(() => rows && rows.length > 0
        ? rows.map((row, index) => {
            if (index === 0) {
                const column = row[0];
                if (typeof column === 'string') {
                    return column;
                } else {
                    return column.value;
                }
            } else {
                return;
            }
        })
        : []
    , [rows]);
    return (
        <Tabs aria-label="Rows' values tabs">
            <TabList>
                {
                    rowsHeaders
                    ? rowsHeaders.map((header, index) => {
                        return (
                            <Tab id={`${header}.${index}.tab`} key={`${header}.${index}.tab`}>
                                { header }
                            </Tab>
                        )
                    })
                    : null
                }
            </TabList>
            {
                rowsHeaders
                ? rowsHeaders.map((header, index) => {
                    return (
                        <TabPanel id={`${header}.${index}.panel`} key={`${header}.${index}.panel`}>
                            <ListView>
                                {
                                    values
                                    ? Array.from(values).map((value, index) => {
                                        return (
                                            <ListViewItem id={value} key={`${value}.${index}`}>
                                                { value }
                                                <NumberField
                                                label="The amount of times the value can be used in this row"
                                                minValue={0}
                                                maxValue={rowsHeaders.length ?? 0} />
                                            </ListViewItem>
                                        )
                                    })
                                    : null
                                }
                            </ListView>
                        </TabPanel>
                    )
                })
                : null
            }
        </Tabs>
    )
}