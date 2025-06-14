import { ColSpecs, RowSpecs } from "@/app/hooks/custom";
import { DynamicTable } from "@/app/lib/utils-client";
import React, { createContext, SetStateAction } from "react";

interface TableContextType {
    table: DynamicTable;
    setVersion: React.Dispatch<SetStateAction<number>> | null;
}
export const TableContext = createContext<TableContextType>({
    table: new DynamicTable(),
    setVersion: null,
});
export const TableDatabaseContext = createContext({});
export const TableHandlersContext = createContext({});
export const AnthropicGenerationContext = createContext({});

export interface TableHandlersType {
    setColumnHeaders?: React.Dispatch<SetStateAction<Array<string>>>,
    setRowHeaders?: React.Dispatch<SetStateAction<Array<string>>>,
    columnHeaders?: Array<string>,
    rowHeaders?: Array<string>,
    values?: Array<string>,
    setValues?: React.Dispatch<SetStateAction<Array<string>>>,
    colSpecs?: Array<ColSpecs>,
    setColSpecs?: React.Dispatch<SetStateAction<Array<ColSpecs>>>,
    rowSpecs?: Array<RowSpecs>,
    setRowSpecs?: React.Dispatch<SetStateAction<Array<RowSpecs>>>,
    handleAddColumn?: () => void,
    handleAddRow?: () => void,
    handleDeleteColumn?: () => void,
    handleDeleteRow?: () => void,
}
export interface TableDatabaseType {
    storedTitle?: string,
    storedRows?: Array<Array<string>>,
    storedValues?: Array<string>,
    storedRowSpecs?: Array<RowSpecs>,
    storedColSpecs?: Array<ColSpecs>,
}
export interface AnthropicGenerationType {
    anthropicAction?: (payload: FormData) => void,
    anthropicPending?: boolean,
    anthropicState?: {
        rows: Array<Array<string>>,
        conflicts: Array<string>,
    }
}