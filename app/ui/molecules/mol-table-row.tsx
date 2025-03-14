"use client"
import { useContext, useState } from "react";
import { Input, Select, SelectItem } from "@heroui/react";
import { useParams } from "next/navigation";
import { TableHandlersContext, TableHandlersType, TableSpecsContext, TableSpecsType } from "@/app/[lang]/table/context";

export default function TableRow ({ rowIndex, colIndex, value }: {
    rowIndex: number,
    colIndex: number,
    value: string,
}) {
    const colLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const params = useParams();
    const lang = params.lang;
    const { setRowHeaders }: TableHandlersType = useContext(TableHandlersContext);
    const { values }: TableSpecsType = useContext(TableSpecsContext);
    const [ text, setText ] = useState<string>(value ?? " ");

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
                value={ text || " " } 
                autoComplete="off" 
                onChange={ e => {
                    setText(e.target.value);
                    setRowHeaders && setRowHeaders (prev => {
                        let duplicate = [...prev];
                        duplicate[rowIndex] = e.target.value;
                        return duplicate;
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
                selectedKeys={ [text] }
                value={ text || " " }
                color={ text && text.endsWith("^") ? "warning" : "default" }
                variant="bordered"
                onChange={ e => setText(e.target.value) }>
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
            value={ text && text.endsWith("^") ? text.slice(0, -1) : text || " " } 
            color={ text && text.endsWith("^") ? "warning" : "default" }
            autoComplete="off" 
            onValueChange={ setText } />
            </td>
        }
        </>
    )
}