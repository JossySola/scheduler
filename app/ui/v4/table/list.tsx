"use client"
import { Dispatch, SetStateAction, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { AnimatePresence, motion } from "motion/react";
import { PlusCircle, Trash } from "../../icons";

export default function ValuesList({ values, setValues }: {
    values: Set<string>,
    setValues: Dispatch<SetStateAction<Set<string>>>
}) {
    const [input, setInput] = useState<string>("");
    const [isDuplicate, setIsDuplicate] = useState<boolean>(false);
    const { lang } = useParams<{ lang: "es" | "en" }>();
    
    const handleAddItem = (value: string) => {
        if (values.has(value)) {
            setIsDuplicate(true);
            return;
        }
        setValues(prev => {
            const newSet = new Set([value]);
            return prev.union(newSet);
        });
    }
    const handleRemoveItem = (value: string) => {
        setValues(prev => {
            const newSet = new Set([value]);
            return prev.difference(newSet);
        });
    }
    const handleValueChange = (value: string) => {
        setInput(value);
        setIsDuplicate(false);
    }
    return (
        <ol className="w-full flex flex-col justify-center items-center">
            <div className="w-full flex flex-row justify-center items-center gap-2 mb-3">
                <Input 
                type="text"
                autoComplete="off" 
                placeholder={ lang === "es" ? "Ingresa un valor" : "Enter a value" }
                value={ input }
                onValueChange={ handleValueChange } />
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
                isDuplicate && <p className="text-danger text-tiny text-left w-full mb-5">{ lang === "es" ? "Este valor ya existe" : "This value already exists" }</p>
            }
            {
                values && Array.from(values.values()).map((item, index) => {
                    return (
                        <AnimatePresence key={index}>
                            <motion.li 
                            className="w-full"
                            initial={{ scale: 0.3 }} 
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}>
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
                        </AnimatePresence>
                    )
                })
            }
        </ol>
    )
}