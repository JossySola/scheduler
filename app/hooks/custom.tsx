"use client"
import { ColumnDef, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, RowData, SortingState } from "@tanstack/react-table";
import { Key, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateColumnName } from "../lib/utils-client";
import CellRenderer from "../ui/v4/input/cell";
import { SharedSelection } from "@heroui/react";

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void,
    triggerRefresh: () => void,
  }
}
export function useCallbackAction <T, Args extends any[]>(callback: (...args: Args) => Promise<T>, initialState: T): {
    state: T;
    isPending: boolean;
    error: Error | null;
    run: (...args: Args) => void,
    reset: () => void;
    cancel: () => void;
} {
    const [ isPending, setIsPending ] = useState<boolean>(false);
    const [ state, setState ] = useState<T>(initialState);
    const [ error, setError ] = useState<Error | null>(null);

    const isMountedRef = useRef<boolean>(false);
    const currentCall = useRef<AbortController | null>(null);

    const run = useCallback((...args: Args) => {
        setIsPending(true);
        setError(null);

        const controller = new AbortController();
        currentCall.current?.abort();
        currentCall.current = controller;

        callback(...args)
        .then(result => {
            if (!controller.signal.aborted && isMountedRef.current) {
                setState(result);
            }
        })
        .catch(reason => {
            if (!controller.signal.aborted && isMountedRef.current) {
                setError(reason);
            }
        })
        .finally(() => {
            if (isMountedRef.current) {
                setIsPending(false);
            }
        });
    }, [callback]);

    const reset = useCallback(() => {
        setState(initialState);
        setError(null);
    }, [initialState]);

    const cancel = useCallback(() => {
        currentCall.current?.abort();
        setIsPending(false);
    }, []);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            currentCall.current?.abort();
        };
    }, []);

    return {
    state,
    isPending,
    error,
    run,
    reset,
    cancel,
  };
}
export type VTData = {
    [columnKey: string]: string;
}

export type ColSpecs = {
    numberOfRows: NumRows,
    amountOfValues: ValAmount,
}
export type NumRows = { [key: string]: number }
export type ValAmount = { [key: string]: Array<number> }

export type RowSpecs = {
    disable: DisableRow,
    count: RowCount,
    enabledValues: EnabledValues,
    enabledColumns: EnabledColumns,
}
export type DisableRow = { [key: number]: boolean }
export type RowCount = { [key: string]: number }
export type EnabledValues = { [key: string]: Array<string> }
export type EnabledColumns = { [key: string]: Array<string> }
export type StatesType = {
    values: Array<string>,
    headerType: Array<Key>,
    data: Array<VTData>,
    interval: number,
    colSpecs: ColSpecs,
    rowSpecs: RowSpecs,
    title: string,
    colsNum: Array<string>,
}

export function useVirtualizedTable (storedData?: {
    user_id: string,
    name: string,
    data: Array<{ [key: string]: string }>,
    values: Array<string>,
    type: Array<string>,
    interval: number,
    cols_specs: { numberOfRows: { [key: string]: number }, amountOfValues: { [key: string]: Array<number> } },
    rows_specs: { disable: { [key: number]: boolean }, count: { [key: string]: number }, enabledValues: { [key: string]: Array<string> }, enabledColumns: { [key: string]: Array<string> } },
    created_at: number,
    updated_at: number,
    cols_num: Array<string>,
}) {
    const [colSpecs, setColSpecs] = useState<ColSpecs>(
        (storedData && storedData.cols_specs) 
        ?? {
        numberOfRows: {},
        amountOfValues: {},
        }
    );
    const [rowSpecs, setRowSpecs] = useState<RowSpecs>(
        (storedData && storedData.rows_specs)
        ?? {
        disable: {},
        count: {},
        enabledValues: {},
        enabledColumns: {},
        }
    );
    const [interval, setInterval] = useState<number>((storedData && storedData.interval) ?? 1);
    const [headerType, setHeaderType] = useState<SharedSelection>(() => {
        if (storedData && storedData.type) {
            return new Set(storedData.type);
        }
        return new Set(["text"]);
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [values, setValues] = useState<Set<string>>(() => {
        if (storedData && storedData.values) {
            return new Set(storedData.values);
        }
        return new Set();
    });
    const [data, setData] = useState<Array<VTData>>(() => {
        if (storedData && storedData.data) {
            return storedData.data;
        }
        return [];
    });
    const [title, setTitle] = useState<string>((storedData && storedData.name) ?? "");
    // Data is an array of objects that will be turned into the rows of your table.
    // Each object in the array represents a row of data.
    
    //const columnHelper = createColumnHelper<VTData>();
    // When called with a row type (TData), it returns a utility for creating different
    // column definition types (Accessor Columns, Display Columns, Grouping Columns).    
    
    const [columns, setColumns] = useState<Array<ColumnDef<VTData>>>(() => {
        if (storedData && storedData.cols_num.length > 0) {
            return storedData.cols_num.map((colName, index) => {
                if (index === 0) {
                    return {
                        id: "indexes",
                        cell: ({row}) => <div className="w-[1.5rem] h-full flex flex-col justify-center items-center">{row.index}</div>,
                    }
                }
                return {
                accessorKey: colName,
                id: colName,
                header: () => <span>{colName}</span>,
                footer: props => props.column.id,
                sortUndefined: 'last',
                sortDescFirst: false,
                enableSorting: true,
                }
            });
        }
        return [
            {
                id: "indexes",
                cell: ({row}) => <div className="w-[1.5rem] h-full flex flex-col justify-center items-center">{row.index}</div>,
            }
        ]
    });
    // Column Defs are just plain objects and it is where we tell TanStack Table
    // how each column should access and/or transform row data with either an
    // accessorKey or accessorFn. Column Defs are the single most important part
    // of building a table.
    useEffect(() => {
        console.log("Cols specs changed: ", colSpecs);
        console.log("Row specs changed: ", rowSpecs);
    }, [colSpecs, rowSpecs]);

    const triggerRefresh = () => {
        setColumns(prev => prev.slice());
    }

    const defaultColumn = useMemo<Partial<ColumnDef<VTData>>>(() => ({
        cell: props => {
            const cellProps = {
                getValue: props.getValue,
                row: props.row,
                column: props.column,
                table: props.table,
                values,
                interval,
                headerType,
                setInterval,
                setHeaderType,
            };
            return <CellRenderer {...cellProps} />;
        },
    }), [values, interval, headerType]);

    const tableConfig = useMemo(() => ({
        columns,
        data,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
            values,
            interval,
            headerType,
        },
        meta: {
            updateData: (rowIndex: number, columnId: string, value: unknown) => {
                setData(prev =>
                    prev.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...prev[rowIndex]!,
                                [columnId]: value as string,
                            }
                        }
                        return row;
                    })
                )
            },
            triggerRefresh,
        },
    }), [columns, data, defaultColumn, sorting, values, interval, headerType]);
    const table = useReactTable(tableConfig);
    // Row Models run under the hood to transform the original data in useful ways that
    // are needed for data grid features like filtering, sorting, grouping, expanding,
    // and pagination.
    const handleAddColumn = () => {
        const columnName = generateColumnName(columns.length - 1);
        setData(prev => prev.map(row => {
            row[columnName] = "";
            return row;
        }))
        setColumns(prev => {
            return [
                ...prev,
                {
                    accessorKey: columnName,
                    id: columnName,
                    header: () => <span>{columnName}</span>,
                    footer: props => props.column.id,
                    sortUndefined: 'last',
                    sortDescFirst: false,
                    enableSorting: true,
                }
            ]
        });
        setColSpecs(prev => ({
            ...prev,
            numberOfRows: {
                ...prev.numberOfRows,
                [columnName]: data.length > 0 ? data.length - 1 : 0,
            },
            amountOfValues: {
                ...prev.amountOfValues,
                [columnName]: new Array().fill(0, data.length - 1, columns.length - 1),
            },
        }));
    }
    const handleAddRow = () => {
        if (columns.length === 1) {
            handleAddColumn();
            return;
        }
        const newRow = {};
        columns.forEach((_, index) => {
            Object.defineProperty(newRow, generateColumnName(index), {
                value: "",
                writable: true,
            });
        })
        setData(prev => [...prev, newRow]);
        setRowSpecs(prev => ({
            ...prev,
            disable: {
                ...prev.disable,
                [data.length]: false,
            },
            count: {
                ...prev.count,
                [data.length]: 0,
            },
            enabledValues: {
                ...prev.enabledValues,
                [data.length]: [],
            },
            enabledColumns: {
                ...prev.enabledColumns,
                [data.length]: [],
            },
        }));
    }
    const handleDeleteColumn = () => {
        if (columns.length === 1) return;

        const columnIndex = columns.length - 1;
        const label = generateColumnName(columnIndex);

        setColumns(prev => prev.slice(0, -1));
        setData(prev => 
            prev.map(row => {
                const { [label]: _, ...rest } = row;
                return rest;
            }
        ));
        setColSpecs(prev => ({
            numberOfRows: Object.fromEntries(Object.entries(prev.numberOfRows).filter(([key]) => key !== label)),
            amountOfValues: Object.fromEntries(Object.entries(prev.amountOfValues).filter(([key]) => key !== label)),
        }));
    }
    const handleDeleteRow = () => {
        if (!data.length) return;
        setData(prev => prev.slice(0, -1));
        setRowSpecs(prev => ({
            disable: Object.fromEntries(Object.entries(prev.disable).filter(([key]) => Number(key) !== (data.length - 1))),
            count: Object.fromEntries(Object.entries(prev.count).filter(([key]) => key !== generateColumnName(data.length - 1))),
            enabledValues: Object.fromEntries(Object.entries(prev.enabledValues).filter(([key]) => Number(key) !== (data.length - 1))),
            enabledColumns: Object.fromEntries(Object.entries(prev.enabledColumns).filter(([key]) => Number(key) !== (data.length - 1))),
        }));
    }
    const getTableStates = () => {
        return {
            values: Array.from(values),
            headerType: Array.from(headerType),
            colsNum: table.getAllColumns().map(col => col.id),
            title,
            data,
            interval,
            colSpecs,
            rowSpecs,
        }
    }
    return {
        table,
        getTableStates,
        state: {
            values,
            headerType,
            interval,
            colSpecs,
            rowSpecs,
            title,
        },
        setter: {
            setValues,
            setColumns,
            setHeaderType,
            setInterval,
            setColSpecs,
            setRowSpecs,
            setTitle,
        },
        controls: {
            handleAddColumn,
            handleAddRow,
            handleDeleteColumn,
            handleDeleteRow,
        },
    }
}