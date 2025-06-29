"use client"
import { TableContext } from "@/app/[lang]/table/context";
import { SetStateAction, useContext } from "react";
import InputValue from "./cell/input";
import InputSelect from "./cell/select";
import InputTime from "./cell/time";
import InputDate from "./cell/date";
import { CalendarDate, Time } from "@internationalized/date";

export default function Cell ({ rowIndex, colIndex, setA1, A1 }: {
    rowIndex: number,
    colIndex: number,
    setA1?: React.Dispatch<SetStateAction<CalendarDate | Time | string | null>>,
    A1?: CalendarDate | Time | string | null,
}) {
    const { table } = useContext(TableContext);
    if (rowIndex === 0 && colIndex !== 0) {
        if (table.columnType === "date") {
            // If it is the first header A1
            if (rowIndex === 0 && colIndex === 1) return <InputDate rowIndex={ rowIndex } colIndex={ colIndex } setA1={ setA1 } />;
            // If it is any other header
            return <InputDate rowIndex={ rowIndex } colIndex={ colIndex } A1={ A1 } />;
        }
        if (table.columnType === "time") {
            // If it is the first header A1
            if (rowIndex === 0 && colIndex === 1) return <InputTime rowIndex={ rowIndex } colIndex={ colIndex } setA1={ setA1 } />;
            // If it is any other header
            return <InputTime rowIndex={ rowIndex } colIndex={ colIndex } A1={ A1 } />;
        }
    }
    if (table.values.size > 0 && rowIndex !== 0 && colIndex !== 0) {
        // If the cell is not either a row or column header AND there are values set
        return <InputSelect rowIndex={ rowIndex } colIndex={ colIndex } />;
    }
    // If it is any other cell
    return <InputValue rowIndex={ rowIndex } colIndex={ colIndex } />;
}