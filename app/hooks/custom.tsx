"use client"
import { ColumnDef, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, RowData, SortingState } from "@tanstack/react-table";
import { useCallback, useEffect, useRef, useState } from "react";
import { generateColumnName } from "../lib/utils-client";
import { Input } from "@heroui/react";
import { motion } from "motion/react";

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

export type RowSpecs = {
    disable:boolean,
    count: number,
    enabledValues: Array<string>,
    enabledColumns: Array<string>,
}
export type ColSpecs = {
    numberOfRows: number,
    amountOfValues: Array<number>,
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
const defaultColumn: Partial<ColumnDef<VTData>> = {
    cell: ({ getValue, row: { index }, column: { id },
    table }) => {
        const initialValue = getValue();
        const [value, setValue] = useState(initialValue);
        const onBlur = () => {
            table.options.meta?.updateData(index, id, value)
        }
        useEffect(() => {
            setValue(initialValue)
        }, [initialValue]);
        return (
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                <Input
                variant="bordered"
                value={value as string ?? ""}
                onValueChange={setValue}
                onBlur={onBlur} />
            </motion.div>
        )
    }
}
export function useVirtualizedTable () {
    const [sorting, setSorting] = useState<SortingState>([]);
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

    const table = useReactTable({
        columns,
        data,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
        meta: {
            updateData: (rowIndex, columnId, value) => {
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
            }
        },
    });
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
        handleAddColumn,
        handleAddRow,
        handleDeleteColumn,
        handleDeleteRow,
    }
}