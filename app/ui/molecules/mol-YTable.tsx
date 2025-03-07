"use client"
import { Specs, useRows } from "@/app/hooks/custom";
import { Button } from "@heroui/react";
import { MinusSquareSmall, PlusSquareSmall } from "geist-icons";
import XList from "./mol-XList";
import AISection from "./mol-AI-section";
import TableColumn from "./mol-table-columns";
import TableRow from "./mol-table-row";

export default function YTable ({ lang, storedRows, storedValues, storedColSpecs, storedSpecs, storedTimestamps }: {
    lang: "en" | "es",
    storedRows?: Array<Array<string>>,
    storedValues?: Array<string>,
    storedColSpecs?: Array<number>,
    storedSpecs?: Specs[],
    storedTimestamps?: { "created_at": number, "updated_at": number },
}) {
    const [ 
        map,
        colHeaders,
        setColHeaders,
        rowHeaders,
        setRowsHeaders,
        specs,
        colSpecs,
        values,
        setValues,
        handleAddColumn, 
        handleDeleteColumn, 
        handleAddRow, 
        handleDeleteRow,
    ] = useRows(storedRows, storedValues, storedSpecs, storedColSpecs); // This custom hook handles the core table data storing it in an Array. Within the Array, each row is represented as a child Array and inside each child Array are the columns' values as strings.
    

    return (
        <>
        <fieldset className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-4 overflow-x-auto w-[90vw] m-5 p-5 rounded-medium border-2 border-default border-small">
            <fieldset className="col-start-2 flex flex-row gap-1 h-fit">
                <Button name="delete-column" id="delete-column" variant="faded" endContent={<MinusSquareSmall />} onPress={() => handleDeleteColumn()}>{lang === "es" ? "Eliminar Columna":"Delete Column" }</Button>
                <Button name="add-column" id="add-column" variant="faded" isDisabled={ map && map[0] && map[0].length === 26} endContent={<PlusSquareSmall color="#66aaf9" />} onPress={() => handleAddColumn()}>{lang === "es" ? "Añadir Columna":"Add Column" }</Button>
            </fieldset>
            
            <fieldset className="col-start-1 flex flex-col gap-1 w-fit">
                <Button name="delete-row" id="delete-row" className="backdrop-blur-sm" variant="faded" endContent={<MinusSquareSmall />} onPress={() => handleDeleteRow()}>{lang === "es" ? "Eliminar Fila":"Delete Row" }</Button>
                <Button name="add-row" id="add-row" className="backdrop-blur-sm" variant="faded" isDisabled={map && map.length === 50} endContent={<PlusSquareSmall color="#66aaf9" />} onPress={() => handleAddRow()}>{lang === "es" ? "Añadir Fila":"Add Row" }</Button>
            </fieldset>

            <table className="w-full overflow-x-scroll flex flex-col col-start-2 row-start-2 mb-6 pb-10 gap-2">
                <thead className="flex flex-col gap-1">
                    <tr className="flex flex-row gap-2">
                    {
                        map && map[0] ? 
                        map[0].map((_, headerIndex: number) => 
                            <TableColumn 
                            headerIndex={ headerIndex }
                            setColHeaders={ setColHeaders }
                            value={ storedRows && storedRows[0] ? storedRows[0][headerIndex] : "" }
                            lang={ lang }
                            maxValue={ map && map[0] && map[0].length - 1 }
                            placeholder={ map && map[0] && map[0].length.toString() }
                            colSpec={ colSpecs[headerIndex] }
                            key={ headerIndex } />
                        ) : []
                    }
                    </tr>
                </thead>
                <tbody className="flex flex-col gap-1">
                {
                   map && map.map((row, rowIndex) => {
                    if (rowIndex !== 0) {
                        return <tr className="flex flex-row gap-2" key={rowIndex}>
                            {
                            row.map((_, colIndex) => {
                                return <TableRow 
                                setRowsHeaders={ setRowsHeaders }
                                rowIndex={ rowIndex } 
                                colIndex={ colIndex } 
                                value={ storedRows && storedRows[rowIndex] ? storedRows[rowIndex][colIndex] : "" } 
                                key={ colIndex }
                                values={ values } 
                                lang={ lang } />
                            })
                            }
                        </tr>
                    }})
                }
                </tbody>
            </table>
        </fieldset>
        
        <fieldset className="w-full flex flex-col justify-center items-center gap-10 sm:gap-0 sm:flex-row sm:items-start ">
            <XList 
            name={ lang === "es" ? "Valores a usar" : "Values to use" }
            items={ values }
            setItems={ setValues } />

            <AISection 
            lang={ lang } 
            values={ values } 
            specs={ specs }
            colHeaders={ colHeaders }
            rowHeaders={ rowHeaders } />
        </fieldset>
        </>
    )
}