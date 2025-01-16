"use client"
import { SetStateAction, useState } from "react";
import XItem from "./mol-XItem";

export default function XList({ name, items, setItems, criteria, values, enableInput = true, enableRemoval = true } : 
    { 
        name: string, 
        items?: Array<string>,
        setItems?: React.Dispatch<SetStateAction<string[]>>,
        criteria?: Array<string>,
        values?: Array<string>,
        enableInput?: boolean,
        enableRemoval?: boolean,
    }) {
    const [ localItems, setLocalItems ] = useState<Array<string>>([]);
    const [ input, setInput ] = useState<string>("");

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
        <ol id={name}>
            <h3>{name}</h3>
            {
                enableInput ? <div><input type="text" name="item" autoComplete="off" onChange={e => { 
                    e.preventDefault();
                    setInput(e.target.value);
                }} />
                <button type="button" onClick={e => {
                    e.preventDefault();
                    handleAddItem(input);
                    setInput("");
                }}>Add</button></div> : null
            }
            
            {
                items ? items.map((item, index) => {
                    return <li key={index}>
                        { criteria ? <XItem name={item} criteria={criteria} values={values} /> : null }
                        {
                            enableRemoval ? <>
                            <input type="text" name={`ValueOption${index}:`} value={item} readOnly/>
                            <button type="button" onClick={(e) => {
                                e.preventDefault();
                                handleRemoveItem(item);
                                }}>Remove
                            </button></> : null
                        }
                        </li>
                }) : 
                localItems.map((item, index) => {
                    return <li key={index}>
                        { criteria ? <XItem name={item} criteria={criteria} values={values} /> : null }
                        {
                            enableRemoval ? <>
                            <input type="text" name={`ValueOption${index}:`} value={item} readOnly/>
                            <button type="button" onClick={(e) => {
                                e.preventDefault();
                                handleRemoveItem(item);
                                }}>Remove
                            </button></> : null
                        }
                        </li>
                })
            }
        </ol>
    )
}