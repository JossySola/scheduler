"use client"
import { VTData } from "@/app/hooks/custom"
import { SharedSelection } from "@heroui/react";
import { Getter, Table } from "@tanstack/react-table"
import { Dispatch, SetStateAction, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import Input from "./input";
import Select from "./select";
import DateInput from "./date";
import TimeInput from "./time";
import CellHeaderSettings from "./cell-header-settings";

export default function CellRenderer ({isLoading, getValue, row, column, table, values, interval, headerType, setInterval, setHeaderType}: {
    isLoading: boolean,
    getValue: Getter<unknown>,
    row: { index: number },
    column: { id: string },
    table: Table<VTData>,
    values: Set<string>,
    interval: number,
    headerType: SharedSelection,
    setInterval: Dispatch<SetStateAction<number>>,
    setHeaderType: Dispatch<SetStateAction<SharedSelection>>,
}) {
    const initialValue = getValue();
    const [isDuplicate, setIsDuplicate] = useState<boolean>(false);
    const handleDuplicates = useDebouncedCallback((val: string) => {
        setIsDuplicate(false);
        if (column.id === "A" && val.length) {
            const isDuplicate = table.getRowModel().rows.some((r, idx) => {
                const value = r.getValue(column.id);
                if (typeof value === "string") {
                    if (value.toUpperCase() === val.toUpperCase() && idx !== row.index) {
                        return true;
                    } else {
                        return false;
                    }
                }
                return value === val && idx !== row.index;
            });
            setIsDuplicate(isDuplicate);
            return;
        }
        if (row.index === 0 && val.length) {
            const cells = table.getRowModel().rows[0].getVisibleCells();
            const isDuplicate = cells.some(cell => {
                const value = cell.getValue();
                if (typeof value === "string") {
                    if (value.toUpperCase() === val.toUpperCase() && cell.column.id !== column.id) {    
                        return true;
                    } else {
                        return false;
                    }
                }
                value === val && cell.column.id !== column.id
            });
            setIsDuplicate(isDuplicate);
            return;
        }
    }, 500);
    if (row.index === 0 && column.id === "A") {
        const props = {
            initialValue,
            handleDuplicates,
            isDuplicate,
            table,
            row,
            column,
            interval,
            headerType,
            setInterval,
            setHeaderType,
        }
        return (
            <CellHeaderSettings {...props} />
        )
    } else if (row.index !== 0 && column.id !== "A") {
        if (values.size === 0) {
            const props = {
                isLoading,
                initialValue,
                handleDuplicates,
                isDuplicate,
                table,
                row,
                column,
                interval,
                headerType,
                setInterval,
                setHeaderType,
            }
            return (
                <Input {...props} />
            );        
        } else if (values.size > 0) {
            const props = {
                isLoading,
                value: typeof initialValue === "string" ? initialValue : "",
                table,
                row,
                column,
                values,
            }  
            return (
                <Select {...props} />
            );                      
        }
    } else if (row.index === 0 && column.id !== "A") {
        const props = {
            initialValue,
            handleDuplicates,
            isDuplicate,
            table,
            row,
            column,
            interval,
            headerType,
            setInterval,
            setHeaderType,
        }
        if (Array.from(headerType)[0] === "date") {
            return (
                <DateInput {...props} />
            );
        } else if (Array.from(headerType)[0] === "time") {
            return (
                <TimeInput {...props} />
            )
        }     
        return (
            <Input {...props} />
        );
    } else {
        const props = {
            isLoading,
            initialValue,
            handleDuplicates,
            isDuplicate,
            table,
            row,
            column,
            interval,
            headerType,
            setInterval,
            setHeaderType,
        }
        return (
            <Input {...props} />
        );    
    }
}