"use client"
import { TableContext } from "@/app/[lang]/table/context";
import { Card, CardBody, NumberInput, Slider } from "@heroui/react";
import { useParams } from "next/navigation";
import { useContext, useState } from "react";

export default function ColSpecs ({ tab }: {
    tab: Map<any, any>,
}) {
    const { lang } = useParams<{ lang: "en" | "es" }>();
    const { table } = useContext(TableContext);
    const [number, setNumber] = useState<number>(tab.get("colTimes"));
    const [amountOfValues, setAmountOfValues] = useState<Array<number>>(tab.get("valueTimes"));
    return (
        <Card>
            <CardBody className="flex flex-col gap-5 p-5">
                <NumberInput
                value={number}
                label={ lang === "es" ? "Número de filas a llenar en esta columna" : "Amount of rows to fill in this column" }
                aria-label={ lang === "es" ? "Número de filas a llenar en esta columna" : "Amount of rows to fill in this column" }
                labelPlacement="outside-left"
                onValueChange={value => {
                    tab.set("colTimes", value);
                    setNumber(value);
                }} />
                {
                    table.values && table.values.map((value: string, index: number) => {
                        return (
                            <Slider
                            color="foreground"
                            minValue={0}
                            maxValue={table.values.length}
                            label={ lang === "es" ? `Usar el valor "${value}" esta cantidad de veces: `: `Use the value "${value}" this amount of times:` }
                            value={ amountOfValues[index] }
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
                                    tab.set("valueTimes", num);
                                } else {
                                    setAmountOfValues(prev => {
                                        const update = [...prev];
                                        if (update[index] !== undefined) update[index] = num[0];
                                        return update;
                                    });
                                    tab.set("valueTimes", num);
                                }
                            }} />
                        )
                    })
                }
            </CardBody>
        </Card>
    )
}