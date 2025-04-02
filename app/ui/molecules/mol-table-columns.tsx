"use client"
import { TableHandlersContext, TableHandlersType, TableSpecsContext, TableSpecsType } from "@/app/[lang]/table/context";
import { Input, NumberInput } from "@heroui/react";
import { useParams } from "next/navigation";
import { useContext, useState } from "react";

export default function TableColumn ({ headerIndex, value }: {
    headerIndex: number,
    value?: string,
}) {
    const colLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const params = useParams();
    const lang = params.lang;
    const { setColumnHeaders, rowHeaders }: TableHandlersType = useContext(TableHandlersContext);
    const { colSpecs, setColSpecs }: TableSpecsType = useContext(TableSpecsContext);
    const [ text, setText ] = useState<string>(value ?? " ");
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
                value={ text }
                variant="flat"
                autoComplete="off"
                onChange={ e => {
                    setText(e.target.value);
                    setColumnHeaders && setColumnHeaders(prev => {
                        let duplicate = [...prev];
                        duplicate[headerIndex] = e.target.value;
                        return duplicate;
                    });
                }} />
            </div>
            {
                headerIndex !== 0 && 
                <NumberInput
                aria-label="Number of rows to fill"
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
                name={`Specification: Column ${colLetters[headerIndex]} named <'${ value ? value : text }'>, must have this fixed amount of rows filled in:`}
                variant="bordered"
                radius="full"
                size="sm"
                description={ lang === "es" ? "Número de filas a llenar en esta columna" : "Amount of rows to fill in this column" }
                minValue={ 0 } 
                maxValue={ rowHeaders?.length ? rowHeaders.length - 1 : 0 }
                value={ Number(colSpecs?.[headerIndex]) ?? ((rowHeaders && rowHeaders?.length - 1) ?? 0) }
                onValueChange={ n => setColSpecs && setColSpecs(prev => {
                    let duplicate = prev ? [...prev] : [];
                    duplicate[headerIndex] = n;
                    return duplicate;
                })}/>
            }
        </th>
    )
}