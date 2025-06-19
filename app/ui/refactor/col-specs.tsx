"use client"
import { TableContext } from "@/app/[lang]/table/context";
import { TableExtended } from "@/app/lib/utils-client";
import { Card, CardBody, NumberInput, Slider } from "@heroui/react";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function ColSpecs ({ colIndex }: {
    colIndex: number,
}) {
    const { lang } = useParams<{ lang: "en" | "es" }>();
    const { table } = useContext(TableContext);
    const column = table.rows[0].get(`${TableExtended.indexToLabel(colIndex)}0`);
    const [number, setNumber] = useState<number>(column?.specs?.colTimes ?? 0);
    const [amountOfValues, setAmountOfValues] = useState<Array<number>>(column?.specs?.valueTimes ?? []);
    useEffect(() => {
        if (column && column.specs) {
            column.specs.colTimes = number;
            column.specs.valueTimes = amountOfValues;
        }
    }, [number, amountOfValues]);
    return (
        <Card>
            <CardBody className="flex flex-col gap-5 p-5">
                <NumberInput
                value={number}
                minValue={0}
                maxValue={table.size > 0 ? table.size - 1 : 0}
                label={ lang === "es" ? "Número de filas a llenar en esta columna" : "Amount of rows to fill in this column" }
                aria-label={ lang === "es" ? "Número de filas a llenar en esta columna" : "Amount of rows to fill in this column" }
                labelPlacement="inside"
                onValueChange={setNumber} />
                {
                    table.values && Array.from(table.values.values()).map((value: string, index: number) => {
                        return (
                            <Slider
                            key={index}
                            color="foreground"
                            minValue={0}
                            maxValue={table.size}
                            label={ lang === "es" ? `Usar el valor "${value}" esta cantidad de veces: `: `Use the value "${value}" this amount of times:` }
                            value={ amountOfValues[index] ?? 0 }
                            showSteps={ true }
                            size="lg"
                            step={ 1 }
                            onChangeEnd={ (num: number | number[]) => {
                                if (typeof num === 'number') {
                                    setAmountOfValues(prev => {
                                        const update = [...prev];
                                        if (update[index] !== undefined) update[index] = num;
                                        return update;
                                    });
                                } else {
                                    setAmountOfValues(prev => {
                                        const update = [...prev];
                                        if (update[index] !== undefined) update[index] = num[0];
                                        return update;
                                    });
                                }
                            }} />
                        )
                    })
                }
            </CardBody>
        </Card>
    )
}