"use client"
import { SetStateAction, useState } from "react";
import XItem from "./mol-XItem";
import { useParams } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { PlusCircle, Trash } from "geist-icons";

export default function XList({ name, preferences, items, setItems, criteria, values, enableInput = true, enableRemoval = true } : 
    { 
        name: string, 
        preferences?: Array<Array<string>>,
        items?: Array<string>,
        setItems?: React.Dispatch<SetStateAction<string[]>>,
        criteria?: Array<string>,
        values?: Array<string>,
        enableInput?: boolean,
        enableRemoval?: boolean,
    }) {
    const [ localItems, setLocalItems ] = useState<Array<string>>([]);
    const [ input, setInput ] = useState<string>("");
    const params = useParams();
    const { lang } = params;

    const handleAddItem = (value: string) => {
        if (!value) {
            return;
        }
        setItems && items ? 
        setItems(prev => {
            const duplicate = items.find(item => item.toUpperCase() === value.toUpperCase());
            if (duplicate) {
                return [ ...prev ]
            }
            return [
                ...prev,
                value
            ]
        }) : setLocalItems(prev => {
            const duplicate = localItems.find(item => item.toUpperCase() === value.toUpperCase());
            if (duplicate) {
                return [ ... prev ]
            }
            return [
                ...prev,
                value
            ]
        })
    }
    const handleRemoveItem = (value: string) => {
        setItems && items ? 
        setItems(() => {
            return items.filter(item => {
                return item !== value;
            })
        }) : 
        setLocalItems(() => {
            return localItems.filter(item => {
                return item !== value;
            })
        })
    }

    return (
        <ol id={name} className="w-fit flex flex-col items-center">
            <h3>{name}</h3>
            {
                enableInput ? <div className="flex flex-row justify-center items-center gap-2">
                    <Input 
                    type="text" 
                    name="list-input" 
                    autoComplete="off" 
                    placeholder={ lang === "es" ? "Ingresa un valor" : "Enter a value" }
                    value={input}
                    onChange={e => {
                    setInput(e.target.value);
                }} />
                <Button 
                isIconOnly 
                variant="flat"
                aria-label="Add item" 
                color="success"
                onPress={() => {
                    handleAddItem(input);
                    setInput("");
                }}>
                    <PlusCircle />
                </Button>
                </div> : null
            }
            
            {
                items ? items.map((item, index) => {
                    const prefs = preferences?.filter(preference => preference[0].includes(item));

                    return <li key={index}>
                        { criteria ? <XItem name={item} preferences={prefs} criteria={criteria} values={values} /> : null }
                        {
                            enableRemoval ? <div className="m-4 flex flex-row justify-center items-center gap-2">
                            <Input 
                            name={`ValueOption${index}:`}
                            value={item} 
                            readOnly 
                            isDisabled />
                            <Button 
                            isIconOnly 
                            variant="flat"
                            color="danger"
                            onPress={() => {
                                handleRemoveItem(item);
                            }}>
                                <Trash />
                            </Button>
                            </div> : null
                        }
                        </li>
                }) : 
                localItems.map((item, index) => {
                    return <li key={index}>
                        { criteria ? <XItem name={item} criteria={criteria} values={values} /> : null }
                        {
                            enableRemoval ? <div className="m-4 flex flex-row justify-center items-center gap-2">
                            <Input 
                            name={`ValueOption${index}:`} 
                            value={item}
                            readOnly 
                            isDisabled />
                            <Button 
                            isIconOnly 
                            variant="flat"
                            onPress={() => {
                                handleRemoveItem(item);
                            }}>
                            { lang === "es" ? "Eliminar" : "Delete"}
                            </Button>
                            </div> : null
                        }
                    </li>
                })
            }
        </ol>
    )
}