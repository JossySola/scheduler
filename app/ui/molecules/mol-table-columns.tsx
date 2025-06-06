"use client"
import { TableHandlersContext, TableHandlersType } from "@/app/[lang]/table/context";
import { Input } from "@heroui/react";
import { useContext, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function TableColumn ({ headerIndex, value }: {
    headerIndex: number,
    value?: string,
}) {
    const colLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const { setColumnHeaders }: TableHandlersType = useContext(TableHandlersContext);
    const [ text, setText ] = useState<string>(value ?? " ");
    const update = () => {
        setColumnHeaders && setColumnHeaders(prev => {
            let updated = [...prev];
            updated[headerIndex] = text;
            return updated;
        })
    }
    const debouncedUpdate = useDebouncedCallback(update, 1000);
    useEffect(() => {
        debouncedUpdate();
    }, [text]);
    return (
        <th scope="col">
            <span className="text-tiny">{`${colLetters[headerIndex]}`}</span>
            <div className="flex flex-row items-center gap-2">
                {
                    headerIndex === 0 && <span className="text-tiny w-[1rem]">0</span>
                }
                <Input 
                name={`${colLetters[headerIndex]}0`}
                classNames={{
                    inputWrapper: [
                        "w-[200px]",
                        "h-[40px]"
                    ]
                }}
                className="w-max"
                value={ text }
                variant="flat"
                autoComplete="off"
                onValueChange={ setText } />
            </div>
        </th>
    )
}