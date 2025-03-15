import { Specs } from "@/app/hooks/custom";
import React, { createContext, SetStateAction } from "react";
import { z } from 'zod';

export const TableSpecsContext = createContext({});
export const TableHandlersContext = createContext({});
export const TableAiGenerationContext = createContext({});

type DeepPartialInternal<T> = T extends null | undefined | string | number | boolean | symbol | bigint | void | Date | RegExp | ((...arguments_: any[]) => unknown) | (new (...arguments_: any[]) => unknown) ? T : T extends Map<infer KeyType, infer ValueType> ? PartialMap<KeyType, ValueType> : T extends Set<infer ItemType> ? PartialSet<ItemType> : T extends ReadonlyMap<infer KeyType, infer ValueType> ? PartialReadonlyMap<KeyType, ValueType> : T extends ReadonlySet<infer ItemType> ? PartialReadonlySet<ItemType> : T extends object ? T extends ReadonlyArray<infer ItemType> ? ItemType[] extends T ? readonly ItemType[] extends T ? ReadonlyArray<DeepPartialInternal<ItemType | undefined>> : Array<DeepPartialInternal<ItemType | undefined>> : PartialObject<T> : PartialObject<T> : unknown;
type PartialMap<KeyType, ValueType> = {} & Map<DeepPartialInternal<KeyType>, DeepPartialInternal<ValueType>>;
type PartialSet<T> = {} & Set<DeepPartialInternal<T>>;
type PartialReadonlyMap<KeyType, ValueType> = {} & ReadonlyMap<DeepPartialInternal<KeyType>, DeepPartialInternal<ValueType>>;
type PartialReadonlySet<T> = {} & ReadonlySet<DeepPartialInternal<T>>;
type PartialObject<ObjectType extends object> = {
    [KeyType in keyof ObjectType]?: DeepPartialInternal<ObjectType[KeyType]>;
};

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
export interface TableAiGenerationType {
    object?: PartialObject<{rows: string[][]}> | undefined,
    submit?: (input: any) => void,
    isLoading?: boolean,
    generation?: string,
    setGeneration?: React.Dispatch<SetStateAction<string>>,
    generateTableRSC?: (formData: FormData) => Promise<void>,
    generateTableUseObject?: (formData: FormData) => void,
}