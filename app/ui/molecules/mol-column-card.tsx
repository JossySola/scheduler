"use client"
import { TableHandlersContext, TableHandlersType } from "@/app/[lang]/table/context";
import { Card, CardBody, NumberInput, Slider } from "@heroui/react";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function ColumnTabCard ({ columnIndex, name }: {
    columnIndex: number,
    name: string,
}) {
    const params = useParams();
    const lang = params.lang;
    const { rowHeaders, columnHeaders, values, colSpecs, setColSpecs }: TableHandlersType = useContext(TableHandlersContext);
    const [ numberOfRows, setNumberOfRows ] = useState<number>((colSpecs && colSpecs[columnIndex] && colSpecs[columnIndex].numberOfRows) ?? 0);
    const [ amountOfValues, setAmountOfValues ] = useState<Array<number>>(() => {
        if (colSpecs && colSpecs[columnIndex] && colSpecs[columnIndex].amountOfValues.length) {
            return colSpecs[columnIndex].amountOfValues;
        }
        const newArray = new Array((values && values.length) ?? 1);
        newArray.fill((rowHeaders && rowHeaders.length - 1) ?? 0);
        return newArray;
    });
    const columnLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const update = () => {
        setColSpecs && setColSpecs(prev => {
            const updated = [...prev];
            if (updated[columnIndex]) {
                updated[columnIndex] = {
                    ...updated[columnIndex],
                    numberOfRows,
                    amountOfValues,
                };
            }
            return updated;
        })
    }
    const debouncedUpdate = useDebouncedCallback(update, 500);
    useEffect(() => {
        debouncedUpdate();
    }, [numberOfRows, amountOfValues]);
    
    return (
        <Card className="p-5">
            <CardBody key={ columnIndex } className="flex flex-col gap-5">
                <NumberInput 
                key={ `row-${columnIndex}-count-${numberOfRows}` }
                aria-label="rows-fill-amount"
                name={ `Specification: Column ${columnLetters[columnIndex]} named <'${ name }'>, must have this fixed amount of rows filled in:` }
                variant="bordered"
                radius="full"
                size="md"
                className="mb-5"
                value={ numberOfRows }
                onValueChange={ setNumberOfRows }
                minValue={ 0 }
                maxValue={ rowHeaders && rowHeaders.length ? rowHeaders.length - 1 : 0 }
                label={ lang === "es" ? "Número de filas a llenar en esta columna" : "Amount of rows to fill in this column" }
                labelPlacement="outside-left" />
                
                {
                    values && rowHeaders && values.map((value, index) => {
                        return <Slider
                            key={ index }
                            aria-label="display-value-times"
                            name={ `Specification: Column ${columnLetters[index]} named <'${ columnHeaders?.[index] }'>, use the value: "${value}" in this column this amount of times:` }
                            color="foreground"
                            label={ lang === "es" ? `Usar el valor "${value}" esta cantidad de veces: `: `Use the value "${value}" this amount of times:` }
                            minValue={ 0 }
                            maxValue={ (rowHeaders && rowHeaders.length - 1 ) ?? 1 }
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
                                } else {
                                    setAmountOfValues(prev => {
                                        const update = [...prev];
                                        if (update[index] !== undefined) update[index] = num[0];
                                        return update;
                                    });
                                }
                            } }
                        />
                    })
                }
            </CardBody>
        </Card>
    )
}