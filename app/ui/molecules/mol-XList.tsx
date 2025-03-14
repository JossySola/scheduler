"use client"
import { useContext, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { PlusCircle, Trash } from "geist-icons";
import { TableSpecsContext, TableSpecsType } from "@/app/[lang]/table/context";

export default function XList({ name } : { 
        name: string,
}) {
    const { values, setValues }: TableSpecsType = useContext(TableSpecsContext);
    const [ input, setInput ] = useState<string>("");
    const params = useParams();
    const { lang } = params;
    
    const handleAddItem = (value: string) => {
        if (!value) {
            return;
        }
        setValues && setValues(prev => {
            const isDuplicate = values ? values.find(item => item.toUpperCase() === value.toUpperCase()) : [];
            if (isDuplicate) {
                return [ ...prev ];
            }
            return [
                ...prev,
                value
            ]
        })
    }
    const handleRemoveItem = (value: string) => {
        setValues && setValues(prev => {
            return prev.filter(item => {
                return item !== value;
            })
        })
    }

    return (
        <ol id={name} className="w-fit flex flex-col justify-center items-center mr-10 ml-10">
            <h3>{name}</h3>
            <div className="w-full flex flex-row justify-center items-center gap-2 mb-3">
                <Input 
                type="text"
                autoComplete="off" 
                placeholder={ lang === "es" ? "Ingresa un valor" : "Enter a value" }
                value={ input }
                onValueChange={ setInput } />
                <Button 
                isIconOnly 
                variant="flat"
                aria-label="Add item" 
                color="primary"
                onPress={() => {
                    handleAddItem(input);
                    setInput("");
                }}>
                    <PlusCircle />
                </Button>
            </div>
            {
                values && values.map((item, index) => {
                    return <li key={index}>
                        <div className="w-full flex flex-row justify-center items-center gap-2 mb-3">
                            <Input 
                            name={`ValueOption${index}:`} 
                            value={ item } 
                            onChange={ e => {
                                setValues && setValues(prev => {
                                    if (!prev) [e.target.value];
                                    let duplicate = [...prev];
                                    duplicate[index] = e.target.value;
                                    return duplicate;
                                })
                            } }/>
                            <Button 
                            isIconOnly 
                            variant="flat"
                            color="danger"
                            onPress={() => {
                                handleRemoveItem(item);
                            }}>
                                <Trash />
                            </Button>
                        </div>
                    </li>
                })
            }
        </ol>
    )
}