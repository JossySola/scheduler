"use client"
import { SetStateAction, useState } from "react";

export default function XList({ name, items, setItems } : 
    { 
        name: string, 
        items?: Array<string>,
        setItems?: React.Dispatch<SetStateAction<string[]>>
    }) {
    const [ localItems, setLocalItems ] = useState<Array<string>>([]);

    const handleAddItem = (formData: FormData) => {
        const value = formData.get("item")?.toString();
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
        <ol id="name">
            <h3>{name}</h3>
            <form action={handleAddItem}>
                <input type="text" name="item" required />
                <button type="submit">Add</button>
            </form>
            {
                items ? items.map((item, index) => {
                    return <li key={index}>{item} <button type="button" onClick={(e) => {
                        e.preventDefault();
                        handleRemoveItem(item);
                    }}>Remove</button></li>
                }) : 
                localItems.map((item, index) => {
                    return <li key={index}>{item} <button type="button" onClick={(e) => {
                        e.preventDefault();
                        handleRemoveItem(item);
                    }}>Remove</button></li>
                })
            }
        </ol>
    )
}