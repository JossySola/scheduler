"use client"
import { useState, SetStateAction } from "react";
import XRows from "./mol-XRows";
import { useParams } from "next/navigation";

export default function XTable ({ rows, setRows, values, cols }:
    {
        rows?: Array<Array<string>>,
        setRows?: React.Dispatch<SetStateAction<string[][]>>,
        values?: Array<string>,
        cols?: Array<number>
    }) {
    
    const [ localRows, setLocalRows ] = useState<Array<Array<string>>>([]);
    const params = useParams();
    const { lang } = params;
    
    const handleAddRow = () => {
        setRows && rows ? setRows(prev => {
            return [
                ...prev,
                rows && rows[0] && rows[0].length ? 
                    rows[0].map(() => {
                        return "";
                    }) :
                    [""]
            ]
        }) : 
        setLocalRows(prev => {
            return [
                ...prev,
                localRows && localRows[0] && localRows[0].length ? 
                    localRows[0].map(() => {
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
            <XRows cols={cols} existingRows={rows ? rows : localRows} setRows={setRows ? setRows : setLocalRows} values={values ? values : []}/>
        </table>
        <button type="button" name="add-row" id="add-row" onClick={() => handleAddRow()}>{lang === "es" ? "Añadir Fila":"Add Row" }</button>
        <button type="button" name="delete-row" id="delete-row" onClick={() => handleDeleteRow()}>{lang === "es" ? "Eliminar Fila":"Delete Row" }</button>

        <button type="button" name="add-column" id="add-column" onClick={() => handleAddColumn()}>{lang === "es" ? "Añadir Columna":"Add Column" }</button>
        <button type="button" name="delete-column" id="delete-column" onClick={() => handleDeleteColumn()}>{lang === "es" ? "Eliminar Columna":"Delete Column" }</button>
        </>
    )
}