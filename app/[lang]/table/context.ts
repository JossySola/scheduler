import { ColSpecs, RowSpecs } from "@/app/hooks/custom";
import React, { createContext, SetStateAction } from "react";

export const TableSpecsContext = createContext({});
export const TableHandlersContext = createContext({});
export const AnthropicGenerationContext = createContext({});

export interface TableSpecsType {
    values?: Array<string>,
    setValues?: React.Dispatch<SetStateAction<Array<string>>>,
    colSpecs?: Array<ColSpecs>,
    setColSpecs?: React.Dispatch<SetStateAction<Array<ColSpecs>>>,
    rowSpecs?: Array<RowSpecs>,
    setRowSpecs?: React.Dispatch<SetStateAction<Array<RowSpecs>>>,
}
export interface TableHandlersType {
    setColumnHeaders?: React.Dispatch<SetStateAction<Array<string>>>,
    setRowHeaders?: React.Dispatch<SetStateAction<Array<string>>>,
    columnHeaders?: Array<string>,
    rowHeaders?: Array<string>,
    handleAddColumn?: () => void,
    handleAddRow?: () => void,
    handleDeleteColumn?: () => void,
    handleDeleteRow?: () => void,
}
export interface AnthropicGenerationType {
    anthropicAction?: (payload: FormData) => void,
    anthropicPending?: boolean,
    anthropicState?: {
        rows: Array<Array<string>>,
        conflicts: Array<string>,
    }
}