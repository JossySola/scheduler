"use client"
import { DisableRow, EnabledColumns, EnabledValues, PreferValues, RowCount, RowSpecs, VTData } from "@/app/hooks/custom";
import { Card, CardBody, Checkbox, CheckboxGroup, NumberInput, Switch, Tab, Tabs } from "@heroui/react";
import { Table } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

export default function RowTabs({ table, setRowSpecs, values }: {
    table: Table<VTData>,
    setRowSpecs: React.Dispatch<React.SetStateAction<RowSpecs>>,
    values: Set<string>,
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

    const numberOfCols = useMemo(() => {
        return table.getRowModel().rows[0]?.getAllCells().length;
    }, [table]);
    const rows = useMemo(() => {
        return table.getRowModel().rows.map(row => row.getValue("A") as string);
    }, [table]);

    const handleNumberInputChange = (colName: string, value: number | ChangeEvent<HTMLInputElement>) => { 
        if (typeof value === "object") return;
        setAmountCols(prev => ({   
            ...prev,
            [colName]: value,
        }
        ))
    }
    const handleDisabledRowChange = (rowIndex: number, isDisabled: boolean) => {
        setDisabledRows(prev => ({
            ...prev,
            [rowIndex]: isDisabled,
        }))
    }
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
                                isSelected={ disabledRows[index] || false }
                                onValueChange={ (e) => handleDisabledRowChange(index, e) }>
                                    {
                                        lang === "es" ? "Deshabilitar fila" : "Disable row"
                                    }
                                </Switch>
                                <NumberInput
                                labelPlacement="outside"
                                size="lg"
                                label={
                                    lang === "es" ? "Número de columnas a llenar en la fila" : "Number of columns to fill on this row"
                                }
                                minValue={0}
                                maxValue={numberOfCols ?? 1}
                                value={amountCols[row as string] || 0}
                                onChange={(value) => handleNumberInputChange(row as string, value)}
                                classNames={{
                                    inputWrapper: "mt-10",
                                }} />

                                <CheckboxGroup
                                color="primary"
                                label={
                                    lang === "es" ? "Deshabilitar estas columnas" : "Disable these columns"
                                }
                                value={ enabledColumns[index] || [] }
                                onChange={ (values) => {
                                    setEnabledColumns(prev => ({
                                        ...prev,
                                        [index]: values,
                                    }))
                                }
                                }>
                                    {
                                        table.getRowModel().rows[0].getAllCells().map((cell, index) => index !== 0 && (
                                            <Checkbox
                                            size="lg"
                                            key={index}
                                            value={cell.getValue() as string}>
                                                {cell.getValue() as string}
                                            </Checkbox>
                                        ))
                                    }
                                </CheckboxGroup>

                                <CheckboxGroup
                                color="primary"
                                label={
                                    lang === "es" ? "Preferir estos valores" : "Prefer these values"
                                }
                                value={ preferValues[index] || [] }
                                onChange={ (values) => {
                                    setPreferValues(prev => ({
                                        ...prev,
                                        [index]: values,
                                    }))
                                }}>
                                    {
                                        values && Array.from(values).map((val: string, index: number) => {
                                            return (
                                                <Checkbox
                                                size="lg"
                                                key={index}
                                                value={val}>
                                                    {val}
                                                </Checkbox>
                                            )
                                        })
                                    }
                                </CheckboxGroup>
                            </CardBody>
                        </Card>
                    </Tab>
                ))
            }
        </Tabs>
    )
}