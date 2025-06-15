"use client"
import { useContext, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { TableContext } from "@/app/[lang]/table/context";
import { motion } from "motion/react";
import { PlusCircle, Trash } from "../icons";

export default function ValuesList() {
    const { table, setVersion } = useContext(TableContext);
    const [ values, setValues ] = useState<Array<string>>(table.values ?? []);
    const [input, setInput] = useState<string>("");
    const { lang } = useParams<{ lang: "es" | "en" }>();
    
    const handleAddItem = (value: string) => {
        setValues(prev => values.length ? [...prev, value] : [value]);
        table.values = [...values, value];
        setVersion && setVersion(v => v + 1);
    }
    const handleRemoveItem = (value: string) => {
        setValues(prev => {
            if (prev.length > 0) {
                return prev.filter((v: string) => value !== v);
            }
            return [];
        });
        table.values = values.length ? values.filter((v: string) => value !== v) : [];
        setVersion && setVersion(v => v + 1);
    }

    return (
        <ol className="w-xs max-w-lg flex flex-col justify-center items-center m-8">
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
                table.values && table.values.map((item, index) => {
                    return <motion.li className="w-full" key={index} initial={{ scale: 0.3 }} animate={{ scale: 1 }}>
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
                    </motion.li>
                })
            }
        </ol>
    )
}