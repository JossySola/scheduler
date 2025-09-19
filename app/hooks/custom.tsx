"use client"
import { ColumnDef, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, RowData, SortingState } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateColumnName } from "../lib/utils-client";
import CellRenderer from "../ui/v4/input/cell";
import { SharedSelection } from "@heroui/react";

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void,
    triggerRefresh: () => void,
  }
}

export function useForcePanelUpdate () {
    const [, setState] = useState(true);
    const panelUpdate = useCallback(() => {
        setState(x => !x);
    }, []);
    return panelUpdate;
}
export function useSettingsUpdate () {
    const [, setState] = useState(true);
    const settingsUpdate = useCallback(() => {
        setState(x => !x);
    }, []);
    return settingsUpdate;
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
export type RowSpecs = {
    disable: DisableRow,
    count: RowCount,
    enabledValues: EnabledValues,
    enabledColumns: EnabledColumns,
    preferValues: PreferValues,
}
export type ColSpecs = {
    numberOfRows: ValAmount,
    amountOfValues: NumRows,
}
export type ValAmount = { [key: string]: number }
export type NumRows = { [key: string]: number }
export type DisableRow = { [key: number]: boolean }
export type RowCount = { [key: number]: number }
export type EnabledValues = { [key: number]: Array<string> }
export type EnabledColumns = { [key: number]: Array<string> }
export type PreferValues = { [key: number]: Array<string> }

export function useVirtualizedTable () {
    const [colSpecs, setColSpecs] = useState<ColSpecs>({
        numberOfRows: {},
        amountOfValues: {},
    });
    const [rowSpecs, setRowSpecs] = useState<RowSpecs>({
        disable: {},
        count: {},
        enabledValues: {},
        enabledColumns: {},
        preferValues: {}
    });
    const [interval, setInterval] = useState<number>(1);
    const [headerType, setHeaderType] = useState<SharedSelection>(() => new Set(["text"]));
    const [sorting, setSorting] = useState<SortingState>([]);
    const [values, setValues] = useState<Set<string>>(new Set());
    const [data, setData] = useState<Array<VTData>>([]);
    // Data is an array of objects that will be turned into the rows of your table.
    // Each object in the array represents a row of data.
    
    //const columnHelper = createColumnHelper<VTData>();
    // When called with a row type (TData), it returns a utility for creating different
    // column definition types (Accessor Columns, Display Columns, Grouping Columns).    
    
    const [columns, setColumns] = useState<Array<ColumnDef<VTData>>>([
        {
            id: "indexes",
            cell: ({row}) => <div className="w-[1.5rem] h-full flex flex-col justify-center items-center">{row.index}</div>,
        }
    ]);
    // Column Defs are just plain objects and it is where we tell TanStack Table
    // how each column should access and/or transform row data with either an
    // accessorKey or accessorFn. Column Defs are the single most important part
    // of building a table.
    useEffect(() => {
        if (Array.from(headerType)[0] === "date") {
            setInterval(1);
        } else if (Array.from(headerType)[0] === "time") {
            setInterval(30);
        }
    }, [headerType]);

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
    }
    const handleDeleteRow = () => {
        if (!data.length) return;
        setData(prev => prev.slice(0, -1));
    }
    return {
        table,
        setData,
        state: {
            values,
            headerType,
            interval,
            colSpecs,
            rowSpecs,
        },
        setter: {
            setValues,
            setColumns,
            setHeaderType,
            setInterval,
            setColSpecs,
            setRowSpecs,
        },
        controls: {
            handleAddColumn,
            handleAddRow,
            handleDeleteColumn,
            handleDeleteRow,
        },
    }
}