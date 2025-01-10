"use client"
import { useState } from "react";
import XRows from "./mol-XRows";

export default function XTable ({ id }: { id: string }) {
    // fetch existing data or provide blank template
    const [ rows, setRows ] = useState<Array<Array<string>>>([]);
    
    const handleAddRow = () => {
        setRows(prev => {
            return [
                ...prev,
                rows && rows[0] && rows[0].length ? 
                    rows[0].map(column => {
                        return "";
                    }) :
                    [""]
            ]
        })
    }
    const handleDeleteRow = () => {
        setRows(() => {
            if (rows && rows.length === 0) {
                return [];
            }
            return rows.filter((_, index) => index !== rows.length - 1 )
        })
    }
    const handleAddColumn = () => {
        setRows(() => {
            if (!rows.length) {
                return [[""]]
            }
            return rows && rows.map(row => {
                return [...row, ""];
            })
        })
    }
    const handleDeleteColumn = () => {
        setRows(prev => {
            if (!rows.length) {
                return [ ...prev ]
            }
            return rows.map(row => {
                const temp = [...row];
                temp.pop();
                return temp;
            })
        })
    }

    return (
        <>
        <table>
            <XRows existingRows={rows} setRows={setRows}/>
        </table>
        <button type="button" name="add-row" id="add-row" onClick={() => handleAddRow()}>Add Row</button>
        <button type="button" name="delete-row" id="delete-row" onClick={() => handleDeleteRow()}>Delete Row</button>

        <button type="button" name="add-column" id="add-column" onClick={() => handleAddColumn()}>Add Column</button>
        <button type="button" name="delete-column" id="delete-column" onClick={() => handleDeleteColumn()}>Delete Column</button>
        </>
    )
}