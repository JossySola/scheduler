"use client"
import { DisableRow, EnabledColumns, EnabledValues, RowCount, RowSpecs, VTData } from "@/app/hooks/custom";
import { Card, CardBody, Checkbox, CheckboxGroup, NumberInput, Switch, Tab, Tabs } from "@heroui/react";
import { Table } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { ChangeEvent, useMemo, useState } from "react";

export default function RowTabs({ table, rowSpecs, setRowSpecs, values }: {
    table: Table<VTData>,
    rowSpecs: RowSpecs,
    setRowSpecs: React.Dispatch<React.SetStateAction<RowSpecs>>,
    values: Set<string>,
}) {
    const { lang } = useParams<{ lang: "es" | "en" }>();
    const [disabledRows, setDisabledRows] = useState<DisableRow>( rowSpecs.disable || {});
    const [amountCols, setAmountCols] = useState<RowCount>( rowSpecs.count || {});
    const [enabledValues, setEnabledValues] = useState<EnabledValues>( rowSpecs.enabledValues || {});
    const [enabledColumns, setEnabledColumns] = useState<EnabledColumns>( rowSpecs.enabledColumns || {});

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
        ));
        setRowSpecs(prev => ({
            ...prev,
            count: {
                ...prev.count,
                [colName]: value,
            },
        }));
    }
    const handleDisabledRowChange = (rowIndex: string, isDisabled: boolean) => {
        setDisabledRows(prev => ({
            ...prev,
            [rowIndex]: isDisabled,
        }));
        setRowSpecs(prev => ({
            ...prev,
            disable: {
                ...prev.disable,
                [rowIndex]: isDisabled,
            },
        }))
    }
    const handleEnabledValuesChange = (rowIndex: string, values: string[]) => {
        setEnabledValues(prev => ({
            ...prev,
            [rowIndex]: values,
        }));
        setRowSpecs(prev => ({
            ...prev,
            enabledValues: {
                ...prev.enabledValues,
                [rowIndex]: values,
            },
        }));
    }
    const handleEnabledColumnsChange = (rowIndex: string, values: string[]) => {
        setEnabledColumns(prev => ({
            ...prev,
            [rowIndex]: values,
        }));
        setRowSpecs(prev => ({
            ...prev,
            enabledColumns: {
                ...prev.enabledColumns,
                [rowIndex]: values,
            },
        }));
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
                                onValueChange={ (e) => handleDisabledRowChange(index.toString(), e) }>
                                    {
                                        lang === "es" ? "Deshabilitar fila" : "Disable row"
                                    }
                                </Switch>
                                <NumberInput
                                isDisabled={disabledRows[index] || false}
                                labelPlacement="outside"
                                size="lg"
                                label={
                                    lang === "es" ? "Número de columnas a llenar en la fila" : "Number of columns to fill on this row"
                                }
                                minValue={0}
                                maxValue={numberOfCols ?? 1}
                                value={amountCols[index] || 0}
                                onChange={(value) => handleNumberInputChange(index.toString(), value)}
                                classNames={{
                                    inputWrapper: "mt-10",
                                }} />

                                <CheckboxGroup
                                color="primary"
                                label={
                                    lang === "es" ? "Deshabilitar estas columnas" : "Disable these columns"
                                }
                                value={ enabledColumns[index] || [] }
                                onChange={ (values) => handleEnabledColumnsChange(index.toString(), values) }>
                                    {
                                        table.getRowModel().rows[0].getAllCells().map((cell, cIndex) => cIndex !== 0 && cIndex !== 1 && (
                                            <Checkbox
                                            isDisabled={disabledRows[index] || false}
                                            size="lg"
                                            key={cIndex}
                                            value={cell.getValue() as string}>
                                                {
                                                    cell.getValue() 
                                                    ? cell.getValue() as string 
                                                    : lang === "es" 
                                                        ? "Sin nombre" 
                                                        : "No name yet"
                                                }
                                            </Checkbox>
                                        ))
                                    }
                                </CheckboxGroup>

                                <CheckboxGroup
                                color="primary"
                                label={
                                    lang === "es" ? "Preferir estos valores" : "Prefer these values"
                                }
                                value={ enabledValues[index] || [] }
                                onChange={ (values) => handleEnabledValuesChange(index.toString(), values) }>
                                    {
                                        values && Array.from(values).map((val: string, cIndex: number) => {
                                            return (
                                                <Checkbox
                                                isDisabled={disabledRows[index] || false}
                                                size="lg"
                                                key={cIndex}
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