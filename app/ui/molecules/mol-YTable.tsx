"use client"
import { useDynamicTableData, useRows } from "@/app/hooks/custom";
import { Button } from "@heroui/react";
import { MinusSquareSmall, PlusSquareSmall } from "geist-icons";
import TableCellInput from "../atoms/atom-table-cell";
import TableTabs from "./mol-YTable-tabs";
import XList from "./mol-XList";

export default function YTable ({ lang, rows }: {
    lang: string,
    rows?: Array<Array<string>> | undefined,
}) {
    const [ 
        localRows, 
        setLocalRows, 
        handleAddColumn, 
        handleDeleteColumn, 
        handleAddRow, 
        handleDeleteRow,
    ] = useRows(rows); // This custom hook handles the core table data storing it in an Array. Within the Array, each row is represented as a child Array and inside each child Array are the columns' values as strings.
    const [
        values,
        setValues,
        criteria,
        setCriteria,
        rowHeaders
    ] = useDynamicTableData(localRows); // This custom hook handles additional table data as Values and Criteria.

    const colLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
        const { value } = event.target;
        setLocalRows(prev => {
            // I chose cloning the previous State array instead of mapping it because I think it will impact
            // the performance if the table grows and an iteration has to take place in every key stroke.
            if (!prev) return prev;
            let clonedRows = [...prev];
            clonedRows[rowIndex] = [...clonedRows[rowIndex]];
            clonedRows[rowIndex][colIndex] = value;
            return clonedRows;
        })
    }

    return (
        <>
        <fieldset className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-4 overflow-x-auto w-[90vw] m-5">
            <fieldset className="col-start-2 flex flex-row gap-1 h-fit">
                <Button name="delete-column" id="delete-column" variant="faded" endContent={<MinusSquareSmall />} onPress={() => handleDeleteColumn()}>{lang === "es" ? "Eliminar Columna":"Delete Column" }</Button>
                <Button name="add-column" id="add-column" variant="faded" endContent={<PlusSquareSmall color="#FF990A" />} onPress={() => handleAddColumn()}>{lang === "es" ? "Añadir Columna":"Add Column" }</Button>
            </fieldset>
            
            <fieldset className="col-start-1 flex flex-col gap-1 w-fit">
                <Button name="delete-row" id="delete-row" className="backdrop-blur-sm" variant="faded" endContent={<MinusSquareSmall />} onPress={() => handleDeleteRow()}>{lang === "es" ? "Eliminar Fila":"Delete Row" }</Button>
                <Button name="add-row" id="add-row" className="backdrop-blur-sm" variant="faded" endContent={<PlusSquareSmall color="#FF990A" />} onPress={() => handleAddRow()}>{lang === "es" ? "Añadir Fila":"Add Row" }</Button>
            </fieldset>

            <table className="flex flex-col col-start-2 row-start-2 mb-6">
                <thead>
                    <tr>
                    {
                        localRows[0] && localRows[0].map((col: string, headerIndex: number) => {
                            return <th scope="col" key={headerIndex}>
                                <TableCellInput 
                                name={`${colLetters[headerIndex]}0`}
                                rowIndex={0} 
                                colIndex={headerIndex} 
                                value={col} 
                                variant="flat"
                                onChange={ e => handleInputChange(e, 0, headerIndex) } />
                            </th>
                        })
                    }
                    </tr>
                </thead>
                <tbody>
                {
                   localRows && localRows.map((row, rowIndex) => {
                    if (rowIndex !== 0) {
                        return <tr key={rowIndex}>
                            {
                                row.map((column, colIndex) => {
                                    if (colIndex === 0) {
                                        return <th scope="row" key={`${colIndex}`}>
                                            <TableCellInput 
                                            name={`${colLetters[colIndex]}${rowIndex + 1}`}
                                            rowIndex={rowIndex} 
                                            colIndex={colIndex} 
                                            value={column} 
                                            variant="flat"
                                            onChange={ e => handleInputChange(e, rowIndex, colIndex) } />
                                        </th>
                                    }
                                    return <td key={`${colIndex}`}>
                                        <TableCellInput 
                                        name={`${colLetters[colIndex]}${rowIndex + 1}`}
                                        rowIndex={rowIndex} 
                                        colIndex={colIndex} 
                                        value={column} 
                                        onChange={ e => handleInputChange(e, rowIndex, colIndex) } />
                                    </td>
                                })
                            }
                        </tr>
                    }
                    })
                }
                </tbody>
            </table>
        </fieldset>
        
        <fieldset className="w-full flex flex-col justify-center items-center gap-12 sm:flex-row sm:items-start">
            <TableTabs 
            name={ lang === "es" ? "Configuración de Filas" : "Rows Settings" }
            lang={ lang as "en" | "es" }
            values={ values }
            criteria={ criteria }
            tabs={ rowHeaders } />

            <XList 
            name={ lang === "es" ? "Valores a usar" : "Values to use" }
            items={ values }
            setItems={ setValues } />
        </fieldset>
        </>
    )
}