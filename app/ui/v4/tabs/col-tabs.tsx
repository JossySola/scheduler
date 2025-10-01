"use client"
import { ColSpecs, NumRows, ValAmount, VTData } from "@/app/hooks/custom";
import { generateColumnName } from "@/app/lib/utils-client";
import { Card, CardBody, NumberInput, Slider, Tab, Tabs } from "@heroui/react";
import { Table } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { ChangeEvent, Dispatch, SetStateAction, useMemo, useState } from "react";

export default function ColTabs({table, values, colSpecs, setColSpecs}: {
    table: Table<VTData>,
    values: Set<string>,
    colSpecs: ColSpecs,
    setColSpecs: Dispatch<SetStateAction<ColSpecs>>,
}) {
    const { lang } = useParams<{ lang: "es" | "en" }>();
    const [numRows, setNumRows] = useState<NumRows>(colSpecs.numberOfRows || {});    
    const [valAmount, setValAmount] = useState<ValAmount>(colSpecs.amountOfValues || {});

    const cols = useMemo(() => {
        return table.getRowModel().rows[0]?.getAllCells().map(cell => cell.getValue());
    }, [table]);
    const numberOfRows = useMemo(() => {
        return table.getRowModel().rows.length - 1;
    }, [table]);

    const handleSliderChange = (value: number | number[], valIndex: number, name: string) => { 
        if (Array.isArray(value)) {
            value = value[0];
        };
        setValAmount(prev => {
            const currentArray = prev[name] || [];
            if (currentArray.length > 0) {
                const newArray = [...currentArray];
                if (newArray[valIndex] === undefined) {
                    newArray.push(value);
                    return ({
                        ...prev,
                        [name]: newArray,
                    })
                }
                newArray[valIndex] = value;
                return ({
                    ...prev,
                    [name]: newArray,
                })
            } else {
                const newArray = Array(Array.from(values).length).fill(0);
                newArray[valIndex] = value;
                return ({
                    ...prev,
                    [name]: newArray,
                })
            }
        });
        setColSpecs(prev => ({
            ...prev,
            amountOfValues: {
                ...prev.amountOfValues,
                [name]: valAmount[name] && Array.isArray(valAmount[name])
                    ? valAmount[name].map((v, i) => i === valIndex ? value as number : v)
                    : Array.from(values).map((v, i) => i === valIndex ? value as number : 0),
            },
        }));
    }
    const handleNumberInputChange = (name: string, value: number | ChangeEvent<HTMLInputElement>) => { 
        if (typeof value === "object") return;
        setNumRows(prev => ({   
            ...prev,
            [name]: value,
        }));
        setColSpecs(prev => ({
            ...prev,
            numberOfRows: {
                ...prev.numberOfRows,
                [name]: value,
            },
        }));
    }
    return (
        <Tabs aria-label="Column settings tabs" size="lg" className="w-full">
            {
                cols && cols.map((col, index) => {
                    const name = generateColumnName(index - 1);
                    if (index !== 0 && index !== 1) {
                        return (
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
                                        value={ numRows[name] || numberOfRows}
                                        onChange={ (value) => handleNumberInputChange(name, value) }
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
                                                        valAmount[name] && Array.isArray(valAmount[name])
                                                        ? valAmount[name][valIndex]
                                                        : 0 
                                                    }
                                                    onChange={ (value) => handleSliderChange(value, valIndex, name) }
                                                    size="lg"
                                                    step={1} />
                                                )
                                            })
                                        }
                                    </CardBody>
                                </Card> 
                            </Tab>
                        )}
                    }
                )
            }
        </Tabs>
    )
}