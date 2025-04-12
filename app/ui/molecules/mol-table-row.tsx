"use client"
import { useContext, useEffect, useMemo, useState } from "react";
import { Input, Select, SelectItem } from "@heroui/react";
import { useParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { AnthropicGenerationContext, AnthropicGenerationType, TableHandlersContext, TableHandlersType } from "@/app/[lang]/table/context";

export default function TableRow ({ rowIndex, colIndex, value }: {
    rowIndex: number,
    colIndex: number,
    value: string,
}) {
    const colLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const params = useParams();
    const lang = params.lang;
    const { setRowHeaders, rowHeaders, values }: TableHandlersType = useContext(TableHandlersContext);
    const { anthropicState }: AnthropicGenerationType = useContext(AnthropicGenerationContext);
    const [ text, setText ] = useState<string>(value ?? "");
    const [ header, setHeader ] = useState<string>((rowHeaders && rowHeaders[rowIndex]) ?? "");
    let error: string = "";
    useEffect(() => {
        if (anthropicState && anthropicState.rows.length && anthropicState.rows[rowIndex] && anthropicState.rows[rowIndex][colIndex]) {
            setText(anthropicState.rows[rowIndex][colIndex]);
        }
    }, [anthropicState]);
    const findClosestValue = (input: string, options: string[]): string | null => {
        if (!input || !options || options.length === 0) return null;
        
        // First try exact match
        if (options.includes(input)) return input;
        
        // Then try case-insensitive match
        const lowerInput = input.toLowerCase();
        const caseInsensitiveMatch = options.find(opt => 
            opt.toLowerCase() === lowerInput);
        if (caseInsensitiveMatch) return caseInsensitiveMatch;
        
        // Then try substring match
        const substringMatch = options.find(opt => 
            opt.includes(input) || input.includes(opt));
        if (substringMatch) return substringMatch;
        
        return null;
    };
    const matchedValue = useMemo(() => {
        if (!values || !text || text.trim() === " ") return null;
        return findClosestValue(text, values);
    }, [text, values]);
    if (colIndex === 0) {
        rowHeaders?.forEach(((header, index) => {
            if (index !== rowIndex && header === text && text !== "") {
                error = lang === "es" ? "Duplicado" : "Duplicate";
            }
        }))
    }
    const update = () => {
        setRowHeaders && setRowHeaders(prev => {
            let updated = [...prev];
            updated[rowIndex] = header;
            return updated;
        })
    }
    const debouncedUpdate = useDebouncedCallback(update, 1000);
    useEffect(() => {
        debouncedUpdate();
    }, [header]);
    return (
        <>
        {
            // Row Header
            colIndex === 0 ? <th scope="row" className="flex flex-row items-center gap-2">
                <span className="text-tiny w-[1rem]">{ rowIndex }</span>
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
                type="text"
                value={ header } 
                autoComplete="off" 
                onValueChange={ setHeader }
                errorMessage={() => (
                    <span className="text-tiny">{ error }</span>
                )} 
                isInvalid={ error && error.length > 0 ? true : false } />
            </th> : 
            // Select Input
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
                selectedKeys={matchedValue ? new Set([matchedValue]) : new Set()}
                defaultSelectedKeys={matchedValue ? new Set([matchedValue]) : new Set()}
                color={ "default" }
                variant="bordered"
                onChange={ e => setText(e.target.value) }>
                    <>
                        <SelectItem key=" ">
                        </SelectItem>
                        {
                            values.map((value) => (
                                <SelectItem key={value}>
                                    {value}
                                </SelectItem>
                            ))
                        }
                    </>
                </Select>
            </td> : 
            // Normal Input
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
                type="text"
                value={ text } 
                color={ "default" }
                autoComplete="off" 
                onValueChange={ setText } />
            </td>
        }
        </>
    )
}