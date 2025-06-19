"use client"
import { useContext, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { TableContext } from "@/app/[lang]/table/context";
import { motion } from "motion/react";
import { PlusCircle, Trash } from "../icons";

export default function ValuesList() {
    const { table, setPanelRender } = useContext(TableContext);
    const [ values, setValues ] = useState<Set<string>>(table.values ?? new Set());
    const [input, setInput] = useState<string>("");
    const { lang } = useParams<{ lang: "es" | "en" }>();
    
    const handleAddItem = (value: string) => {
        setValues(prev => values.size > 0 ? prev.add(value) : new Set(value));
        if (table.values.has(value)) {
            return;
        }
        table.values.add(value);
        setPanelRender && setPanelRender(v => v++);
    }
    const handleRemoveItem = (value: string) => {
        setValues(prev => {
            if (values.size > 0) {
                prev.delete(value);
                return prev;
            }
            return prev;
        });
        table.values.delete(value);
        setPanelRender && setPanelRender(v => v++);
    }

    return (
        <ol className="w-full flex flex-col justify-center items-center p-8">
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
                table.values && Array.from(table.values.values()).map((item, index) => {
                    return <motion.li className="w-full" key={index} initial={{ scale: 0.3 }} animate={{ scale: 1 }}>
                        <div className="w-full flex flex-row justify-center items-center gap-2 mb-3">
                            <Input 
                            isReadOnly
                            name={"list-value"} 
                            value={ item } />
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