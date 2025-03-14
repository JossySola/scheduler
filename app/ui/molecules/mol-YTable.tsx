"use client"
import { Button } from "@heroui/react";
import { MinusSquareSmall, PlusSquareSmall } from "geist-icons";
import TableColumn from "./mol-table-columns";
import TableRow from "./mol-table-row";
import { useContext } from "react";
import { TableHandlersContext, TableHandlersType } from "@/app/[lang]/table/context";

export default function YTable ({ lang, storedRows }: { 
    lang: "es" | "en",
    storedRows?: Array<Array<string>>,
}) {
    const {
    columnHeaders, 
    rowHeaders,
    handleAddColumn,
    handleAddRow,
    handleDeleteColumn,
    handleDeleteRow }: TableHandlersType = useContext(TableHandlersContext);
    return (
        <fieldset className="grid grid-cols-[150px_1fr] sm:grid-cols-[auto_1fr] grid-rows-[auto_1fr] w-full sm:w-[90vw] gap-4 overflow-x-auto w-[90vw] mt-5 sm:m-5 p-5 rounded-medium border-2 border-default border-small">
            <fieldset className="col-start-1 flex flex-row gap-1 h-fit sm:col-start-2">
                <Button name="delete-column" id="delete-column" variant="faded" endContent={<MinusSquareSmall />} onPress={() => handleDeleteColumn && handleDeleteColumn()}>{lang === "es" ? "Eliminar Columna":"Delete Column" }</Button>
                <Button name="add-column" id="add-column" variant="faded" isDisabled={ columnHeaders && columnHeaders[0] && columnHeaders[0].length === 26 ? true : false } endContent={<PlusSquareSmall color="#66aaf9" />} onPress={() => handleAddColumn && handleAddColumn()}>{lang === "es" ? "Añadir Columna":"Add Column" }</Button>
            </fieldset>
            
            <fieldset className="col-start-1 flex flex-col gap-1 w-fit">
                <Button name="delete-row" id="delete-row" className="backdrop-blur-sm" variant="faded" endContent={<MinusSquareSmall />} onPress={() => handleDeleteRow && handleDeleteRow()}>{lang === "es" ? "Eliminar Fila":"Delete Row" }</Button>
                <Button name="add-row" id="add-row" className="backdrop-blur-sm" variant="faded" isDisabled={rowHeaders && rowHeaders.length === 50} endContent={<PlusSquareSmall color="#66aaf9" />} onPress={() => handleAddRow && handleAddRow()}>{lang === "es" ? "Añadir Fila":"Add Row" }</Button>
            </fieldset>

            <table className="col-start-2 row-start-2 w-full overflow-x-scroll flex flex-col mb-6 pb-10 gap-2">
                <thead className="flex flex-col gap-1">
                    <tr className="flex flex-row gap-2">
                    { 
                        columnHeaders && columnHeaders.map((column: string, headerIndex: number) => {
                            return <TableColumn headerIndex={ headerIndex } value={ column } key={ headerIndex } />
                        })
                    }
                    </tr>
                </thead>
                <tbody className="flex flex-col gap-1">
                {
                    rowHeaders && rowHeaders.map((row: string, rowIndex: number) => {
                        if (rowIndex !== 0) {
                            return <tr className="flex flex-row gap-2" key={ rowIndex }>
                                {
                                    columnHeaders && columnHeaders.map((_: string, columnIndex: number) => {
                                        return <TableRow 
                                        rowIndex={ rowIndex } 
                                        colIndex={ columnIndex } 
                                        value={ storedRows ? storedRows[rowIndex][columnIndex] : row } 
                                        key={ columnIndex } />
                                    })
                                }
                            </tr>
                        }
                    })
                }
                </tbody>
            </table>
        </fieldset>
    )
}