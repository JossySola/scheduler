"use client"
import { useState, SetStateAction } from "react";
import XRows from "./mol-XRows";

export default function XTable ({ id, rows, setRows }:
    { 
        id: string,
        rows?: Array<Array<string>>,
        setRows?: React.Dispatch<SetStateAction<string[][]>>
    }) {
    
    const [ localRows, setLocalRows ] = useState<Array<Array<string>>>([]);
    
    const handleAddRow = () => {
        setRows && rows ? setRows(prev => {
            return [
                ...prev,
                rows && rows[0] && rows[0].length ? 
                    rows[0].map(column => {
                        return "";
                    }) :
                    [""]
            ]
        }) : 
        setLocalRows(prev => {
            return [
                ...prev,
                localRows && localRows[0] && localRows[0].length ? 
                    localRows[0].map(column => {
                        return "";
                    }) :
                    [""]
            ]
        })
    }
    const handleDeleteRow = () => {
        setRows && rows ? setRows(() => {
            if (rows && rows.length === 0) {
                return [];
            }
            return rows.filter((_, index) => index !== rows.length - 1 )
        }) :
        setLocalRows(() => {
            if (localRows && localRows.length === 0) {
                return [];
            }
            return localRows.filter((_, index) => index !== localRows.length - 1 )
        })
    }
    const handleAddColumn = () => {
        setRows && rows ? setRows(() => {
            if (!rows.length) {
                return [[""]]
            }
            return rows && rows.map(row => {
                return [...row, ""];
            })
        }) : 
        setLocalRows(() => {
            if (!localRows.length) {
                return [[""]]
            }
            return localRows && localRows.map(row => {
                return [...row, ""];
            })
        })
    }
    const handleDeleteColumn = () => {
        setRows && rows ? setRows(prev => {
            if (!rows.length) {
                return [ ...prev ]
            }
            return rows.map(row => {
                const temp = [...row];
                temp.pop();
                return temp;
            })
        }) : 
        setLocalRows(prev => {
            if (!localRows.length) {
                return [ ...prev ]
            }
            return localRows.map(row => {
                const temp = [...row];
                temp.pop();
                return temp;
            })
        })
    }

    return (
        <>
        <table>
            <XRows existingRows={rows ? rows : localRows} setRows={setRows ? setRows : setLocalRows}/>
        </table>
        <button type="button" name="add-row" id="add-row" onClick={() => handleAddRow()}>Add Row</button>
        <button type="button" name="delete-row" id="delete-row" onClick={() => handleDeleteRow()}>Delete Row</button>

        <button type="button" name="add-column" id="add-column" onClick={() => handleAddColumn()}>Add Column</button>
        <button type="button" name="delete-column" id="delete-column" onClick={() => handleDeleteColumn()}>Delete Column</button>
        </>
    )
}