"use client"
import { TableContext } from "@/app/[lang]/table/context";
import { RowType } from "@/app/lib/utils-client";
import { Card, CardBody, Checkbox, CheckboxGroup, NumberInput, Switch } from "@heroui/react";
import { useParams } from "next/navigation"
import { useContext, useEffect, useState } from "react";

export default function RowSpecs ({ rowIndex }: {
    rowIndex: number,
}) {
    const { lang } = useParams<{ lang: "en" | "es" }>();
    const { table } = useContext(TableContext);
    const row = table.rows[rowIndex].get(`A${rowIndex}`);
    const [toggle, setToggle] = useState<boolean>(row?.specs?.disabled ?? false);
    const [disabledCols, setDisabledCols] = useState<Array<string>>(row?.specs?.disabledCols ?? []);
    const [number, setNumber] = useState<number>(row?.specs?.rowTimes ?? 0);
    const [preferValues, setPreferValues] = useState<Array<string>>(row?.specs?.preferValues ?? []);
    useEffect(() => {
        if (row && row.specs) {
            row.specs.disabled = toggle;
            row.specs.disabledCols = disabledCols;
            row.specs.rowTimes = number;
            row.specs.preferValues = preferValues;
        }
    }, [toggle, disabledCols, number, preferValues]);
    return (
        <Card>
            <CardBody className="flex flex-col gap-5 p-5">
                <Switch 
                color="danger" 
                isSelected={toggle}
                onValueChange={setToggle}>
                    { lang === "es" ? "Deshabilitar en todas las columnas" : "Disable on all columns" }
                </Switch>

                <CheckboxGroup 
                isDisabled={toggle} 
                value={disabledCols}
                onValueChange={setDisabledCols}
                label={ lang === "es" ? "Habilitar solo en ciertas columnas:" : "Enable/disable on certain columns:" }>
                    {
                        table.rows[0] && Array.from(table.rows[0].values()).map((col: RowType, colIndex: number) => {
                            if (colIndex !== 0) {
                                return <Checkbox key={colIndex} value={col.value}>
                                    { col.value ? col.value : lang === "es" ? <i>Sin nombre</i> : <i>No name yet</i> }
                                </Checkbox>
                            }
                        })
                    }
                </CheckboxGroup>

                <NumberInput 
                label={ lang === "es" ? "¿En cuántas columnas debería de aparecer?" : "In how many columns should it appear?" }
                aria-label={ lang === "es" ? "Cantidad de columnas" : "Columns' amount" }
                labelPlacement="inside"
                isDisabled={toggle}
                value={number}
                minValue={0}
                maxValue={table.rows[0].size > 0 ? table.rows[0].size - 1 : 0}
                onValueChange={setNumber} />

                <CheckboxGroup
                isDisabled={toggle}
                value={preferValues}
                onValueChange={setPreferValues}
                label={ lang === "es" ? "Preferir usar estos valores en la fila:" : "Prefer the following values to use in this row:"}>
                    {
                        table.values && Array.from(table.values.values()).map((val: string, valIndex: number) => {
                            return <Checkbox key={valIndex} value={val}>
                                { val ? val : lang === "es" ? <i>Sin nombre</i> : <i>No name yet</i> }
                            </Checkbox>
                        })
                    }
                </CheckboxGroup>
            </CardBody>
        </Card>
    )
}