"use client"
import { useContext, useEffect, useMemo, useState } from "react";
import { Input, Select, SelectItem } from "@heroui/react";
import { useParams } from "next/navigation";
import { TableAiGenerationContext, TableAiGenerationType, TableHandlersContext, TableHandlersType, TableSpecsContext, TableSpecsType } from "@/app/[lang]/table/context";

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
    const { object }: TableAiGenerationType = useContext(TableAiGenerationContext);
    const [ text, setText ] = useState<string>(" ");
    
    // For debugging - logs the values list to check if AI generated values exist in the options
    useEffect(() => {
        if (object && object.rows && values && values.length > 0) {
            const aiValue = object.rows[rowIndex]?.[colIndex];
            if (aiValue) {
                console.log(`Row ${rowIndex}, Col ${colIndex} - Value "${aiValue}" exists in options:`, 
                    values.includes(aiValue));
            }
        }
    }, [object, values, rowIndex, colIndex]);

    // Combined effect to handle both initial and AI-updated values
    useEffect(() => {
        // Handle initial value
        if (value && value.trim() !== " ") {
            setText(value);
        }
        
        // Handle AI-generated value
        if (object && object.rows && object.rows[rowIndex] && object.rows[rowIndex][colIndex] !== undefined) {
            const newValue = object.rows[rowIndex][colIndex];
            // Only update if there's actually a value
            if (newValue !== null && newValue !== undefined && newValue !== "") {
                setText(newValue);
            }
        }
    }, [value, object, rowIndex, colIndex]);

    // Find closest match in values list if exact match doesn't exist
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

    // Try to find a match in the values list
    const matchedValue = useMemo(() => {
        if (!values || !text || text.trim() === " ") return null;
        return findClosestValue(text, values);
    }, [text, values]);

    return (
        <>
        {
            // Row Header
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
                color={ text && text.endsWith("^") ? "warning" : "default" }
                variant="bordered"
                onChange={ e => setText(e.target.value) }>
                    {
                        values.map((value) => (
                            <SelectItem key={value}>
                                {value}
                            </SelectItem>
                        ))
                    }
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