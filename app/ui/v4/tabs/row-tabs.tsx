"use client"
import { DisableRow, EnabledColumns, EnabledValues, PreferValues, RowCount, RowSpecs, VTData } from "@/app/hooks/custom";
import { Card, CardBody, Switch, Tab, Tabs } from "@heroui/react";
import { Table } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function RowTabs({ table, setRowSpecs }: {
    table: Table<VTData>,
    setRowSpecs: React.Dispatch<React.SetStateAction<RowSpecs>>,
}) {
    const { lang } = useParams<{ lang: "es" | "en" }>();
    const [disabledRows, setDisabledRows] = useState<DisableRow>({});
    const [amountCols, setAmountCols] = useState<RowCount>({});
    const [enabledValues, setEnabledValues] = useState<EnabledValues>({});
    const [enabledColumns, setEnabledColumns] = useState<EnabledColumns>({});
    const [preferValues, setPreferValues] = useState<PreferValues>({});

    useEffect(() => {
        setRowSpecs(prev => ({
            ...prev,
            disable: {
                ...prev.disable,
                ...disabledRows,
            },
            count: {
                ...prev.count,
                ...amountCols,
            },
            enabledValues: {
                ...prev.enabledValues,
                ...enabledValues,
            },
            enabledColumns: {
                ...prev.enabledColumns,
                ...enabledColumns,
            },
            preferValues: {
                ...prev.preferValues,
                ...preferValues,
            },
        }))
    }, [disabledRows, amountCols, enabledValues, enabledColumns, preferValues]);

    const rows = useMemo(() => {
        return table.getRowModel().rows.map(row => row.getValue("A") as string);
    }, [table]);
    return (
        <Tabs 
        isVertical 
        size="lg"
        aria-label="Row settings tabs"
        fullWidth={ true }
        classNames={{
            panel: "w-2/3",
            tabWrapper: "",
            base: "w-1/3",
            tabList: "w-full",
            tab: "overflow-hidden",
            tabContent: "w-full truncate",
        }}>
            {
                rows && rows.map((row, index) => index !== 0 && (
                    <Tab
                    key={index}
                    title={
                        row && typeof row === "string" 
                        ? row 
                        : lang === "es"
                            ? "Sin nombre"
                            : "No name yet"    
                    }>
                        <Card>
                            <CardBody className="flex flex-col gap-5 p-5">
                                <Switch 
                                color="danger" 
                                size="lg"
                                value={ disabledRows[index] ? "on" : "off" }
                                onChange={ (e) => {
                                    const isChecked = e.target.checked;
                                    setDisabledRows(prev => ({
                                        ...prev,
                                        [index]: isChecked,
                                    }))
                                }}>
                                    {
                                        lang === "es" ? "Deshabilitar fila" : "Disable row"
                                    }
                                </Switch>
                                
                            </CardBody>
                        </Card>
                    </Tab>
                ))
            }
        </Tabs>
    )
}