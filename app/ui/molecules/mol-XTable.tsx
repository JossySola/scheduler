"use client"
import { useState, SetStateAction } from "react";
import XRows from "./mol-XRows";
import { useParams } from "next/navigation";
import { Button } from "@heroui/react";
import { MinusSquareSmall, PlusSquareSmall } from "geist-icons";

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
        <section className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-4 overflow-x-auto w-[90vw]">
            <fieldset className="col-start-2 flex flex-row gap-1 h-fit sticky left-0">
                <Button name="delete-column" id="delete-column" variant="flat" endContent={<MinusSquareSmall />} onPress={() => handleDeleteColumn()}>{lang === "es" ? "Eliminar Columna":"Delete Column" }</Button>
                <Button name="add-column" id="add-column" variant="flat" endContent={<PlusSquareSmall color="#FF990A" />} onPress={() => handleAddColumn()}>{lang === "es" ? "Añadir Columna":"Add Column" }</Button>
            </fieldset>
            
            <fieldset className="col-start-1 flex flex-col gap-1 w-fit sticky left-0">
                <Button name="delete-row" id="delete-row" variant="flat" endContent={<MinusSquareSmall />} onPress={() => handleDeleteRow()}>{lang === "es" ? "Eliminar Fila":"Delete Row" }</Button>
                <Button name="add-row" id="add-row" variant="flat" endContent={<PlusSquareSmall color="#FF990A" />} onPress={() => handleAddRow()}>{lang === "es" ? "Añadir Fila":"Add Row" }</Button>
            </fieldset>
            <table className="col-start-2 row-start-2">
                <XRows cols={cols} existingRows={rows ? rows : localRows} setRows={setRows ? setRows : setLocalRows} values={values ? values : []}/>
            </table>
        </section>
    )
}