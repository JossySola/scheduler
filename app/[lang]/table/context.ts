import { Specs } from "@/app/hooks/custom";
import React, { createContext, SetStateAction } from "react";

export const TableSpecsContext = createContext({});
export const TableHandlersContext = createContext({});

export interface TableSpecsType {
    values?: Array<string>,
    setValues?: React.Dispatch<SetStateAction<Array<string>>>,
    colSpecs?: Array<number>,
    setColSpecs?: React.Dispatch<SetStateAction<Array<number>>>,
    specs?: Array<Specs>,
    setSpecs?: React.Dispatch<SetStateAction<Array<Specs>>>,
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