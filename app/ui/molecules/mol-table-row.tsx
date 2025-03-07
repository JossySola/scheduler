"use client"
import { SetStateAction, useState } from "react";
import { Input, Select, SelectItem } from "@heroui/react";

export default function TableRow ({ setRowsHeaders, rowIndex, colIndex, value, values, lang }: {
    setRowsHeaders: React.Dispatch<SetStateAction<string[]>>,
    rowIndex: number,
    colIndex: number,
    value: string,
    values: string[],
    lang: "en" | "es",
}) {
    const colLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const [ cell, setCell ] = useState<string>(value ?? "");

    return (
        <>
        {
            colIndex === 0 ? <th scope="row" className="flex flex-row items-center gap-2">
                <span className="text-tiny">{ rowIndex }</span>
                <Input 
                name={`${colLetters[colIndex]}${rowIndex}`}
                classNames={{
                    inputWrapper: [
                        "w-[200px]",
                        "h-[40px]"
                    ]
                }}
                className="w-max"
                variant="flat"
                size="sm"
                type="text"
                value={ cell } 
                autoComplete="off" 
                onChange={ e => {
                    setCell(e.target.value);
                    setRowsHeaders(prev => {
                        let clone = [...prev];
                        clone[rowIndex] = e.target.value;
                        return clone;
                    })
                }} />
            </th> : 
            values && values.length ? <td>
                <Select
                name={`${colLetters[colIndex]}${rowIndex}`}
                className="max-w-xs"
                classNames={{
                    innerWrapper: [
                        "w-[172px]",
                        "h-[40px]"
                    ]
                }}
                placeholder={ lang === "es" ? "Selecciona un valor" : "Select a value" }
                selectedKeys={ [cell] }
                value={ cell }
                variant="bordered"
                onChange={ e => setCell(e.target.value) }>
                    {
                        values.map((value, index) => {
                            return <SelectItem key={`${value}-${index}`}>{ value }</SelectItem>
                        })
                    }
                </Select>
            </td> : 
            <td>
            <Input 
            name={`${colLetters[colIndex]}${rowIndex}`}
            classNames={{
                inputWrapper: [
                    "w-[200px]",
                    "h-[40px]"
                ],
                innerWrapper: [
                    "w-[184px]",
                    "h-[40px]"
                ],
                input: [
                    "w-[184px]",
                    "h-[20px]"
                ]
            }}
            variant="bordered"
            size="sm"
            type="text"
            value={ cell } 
            autoComplete="off" 
            onValueChange={ setCell } />
            </td>
        }
        </>
    )
}