"use client"
import { Input, NumberInput } from "@heroui/react";
import { SetStateAction, useState } from "react";

export default function TableColumn ({ setColHeaders, maxValue, placeholder, headerIndex, value, lang, colSpec }: {
    setColHeaders: React.Dispatch<SetStateAction<string[]>>,
    maxValue: number,
    placeholder: string,
    headerIndex: number,
    value?: string,
    lang: "es" | "en",
    storedRows?: string[][],
    colSpec: number,
}) {
    const colLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const [ cell, setCell ] = useState<string>(value ?? "");
    const [ number, setNumber ] = useState<number>(colSpec ?? 0);
    return (
        <th scope="col">
            <span className="text-tiny">{`${colLetters[headerIndex]}`}</span>

            <div className="flex flex-row items-center gap-2">
                {
                    headerIndex === 0 && <span className="text-tiny">0</span>
                }
                <Input 
                name={`${colLetters[headerIndex]}0`}
                classNames={{
                    inputWrapper: [
                        "w-[200px]",
                        "h-[40px]"
                    ]
                }}
                value={ cell }
                variant="flat"
                onChange={ e => {
                    setCell(e.target.value);
                    setColHeaders(prev => {
                        let clone = [...prev];
                        clone[headerIndex] = e.target.value;
                        return clone;
                    });
                } } />
            </div>
            

            {
                headerIndex !== 0 && 
                <NumberInput 
                classNames={{
                    input: [
                        "w-1/6",
                    ],
                    inputWrapper: [
                        "text-center",
                        "w-32",
                        "m-2",
                    ],
                    innerWrapper: [
                        "flex",
                        "flex-row",
                        "justify-center",
                        "items-center",
                    ],
                    helperWrapper: [
                        "w-[186px]"
                    ]
                }}
                name={`Specification:Column:${value ? value : cell}-must-have-this-amount-of-cells-filled-in`}
                variant="bordered"
                radius="full"
                size="sm"
                description={ lang === "es" ? "Número de filas a llenar en esta columna" : "Amount of rows to fill in this column" }
                minValue={ 0 } 
                maxValue={ maxValue }
                placeholder={ placeholder }
                value={ number }
                onValueChange={ setNumber }/>
            }
        </th>
    )
}