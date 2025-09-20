"use client"
import { ColSpecs, NumRows, ValAmount, VTData } from "@/app/hooks/custom";
import { Card, CardBody, NumberInput, Slider, Tab, Tabs } from "@heroui/react";
import { Table } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

export default function ColTabs({table, values, colSpecs, setColSpecs}: {
    table: Table<VTData>,
    values: Set<string>,
    colSpecs: ColSpecs,
    setColSpecs: Dispatch<SetStateAction<ColSpecs>>,
}) {
    const { lang } = useParams<{ lang: "es" | "en" }>();
    const [numRows, setNumRows] = useState<NumRows>(colSpecs.numberOfRows || {});    
    const [valAmount, setValAmount] = useState<ValAmount>(colSpecs.amountOfValues || {});

    useEffect(() => {
        setColSpecs(prev => {
            return {
                ...prev,
                numberOfRows: {
                    ...prev.numberOfRows,
                    ...numRows,
                },
                amountOfValues: {
                    ...prev.amountOfValues,
                    ...valAmount,
                },
            }
        })
    }, [valAmount, numRows]);

    const cols = useMemo(() => {
        return table.getRowModel().rows[0]?.getAllCells().map(cell => cell.getValue());
    }, [table]);
    const numberOfRows = useMemo(() => {
        return table.getRowModel().rows.length - 1;
    }, [table]);

    const handleSliderChange = (colName: string, value: number | number[], index: number) => { 
        if (Array.isArray(value)) {
            value = value[0];
        };
        
        setValAmount(prev => {
            const currentArray = prev[colName] || [];
            console.log(currentArray)
            if (currentArray.length > 0) {
                const newArray = [...currentArray];
                console.log(newArray[index])
                if (newArray[index] === undefined) {
                    newArray.push(value);
                    return ({
                        ...prev,
                        [colName]: newArray,
                    })
                }
                newArray[index] = value;
                return ({
                    ...prev,
                    [colName]: newArray,
                })
            } else {
                const newArray = Array(Array.from(values).length).fill(0);
                newArray[index] = value;
                return ({
                    ...prev,
                    [colName]: newArray,
                })
            }
        })
    }
    const handleNumberInputChange = (colName: string, value: number | ChangeEvent<HTMLInputElement>) => { 
        if (typeof value === "object") return;
        setNumRows(prev => ({   
            ...prev,
            [colName]: value,
        }))
    }
    return (
        <Tabs aria-label="Column settings tabs" size="lg" className="w-full">
            {
                cols && cols.map((col, index) => index !== 0 && index !== 1 && (
                    <Tab 
                    key={index} 
                    title={ 
                        col && typeof col === "string" 
                            ? col 
                            : lang === "es" 
                                ? "Sin nombre" 
                                : "No name yet"
                    }>
                       <Card>
                            <CardBody className="flex flex-col gap-5 p-5">
                                <NumberInput 
                                minValue={ 0 }
                                maxValue={ numRows[col as string] || numberOfRows }
                                value={ numRows[col as string] || numberOfRows }
                                onChange={ (value) => handleNumberInputChange(col as string, value) }
                                size="lg"
                                label={ lang === "es" ? "Número de filas a llenar en ésta columna" : "Number of rows to fill on this column" }/>
                                {
                                    values && Array.from(values).map((val: string, valIndex: number) => {
                                        return (
                                            <Slider
                                            label={ lang === "es" ? `Usar "${val}" éste número de veces:` : `Use "${val}" this amount of times:` }
                                            key={ valIndex }
                                            minValue={ 0 }
                                            maxValue={ numberOfRows }
                                            value={ 
                                                valAmount[col as string] && Array.isArray(valAmount[col as string])
                                                ? valAmount[col as string][valIndex] 
                                                : 0 
                                            }
                                            onChange={ (value) => handleSliderChange(col as string, value, valIndex) }
                                            size="lg"
                                            step={1} />
                                        )
                                    })
                                }
                            </CardBody>
                        </Card> 
                    </Tab>
                ))
            }
        </Tabs>
    )
}