import { use, useCallback, useEffect, useState } from "react"
import useSWR from "swr"

export function useHTMLTable () {
    const [rows, setRows] = useState<Array<Array<{id: string, value: string}>>>([]);
    const columnLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    
    const handleInputChange = useCallback((rowIndex: number, colIndex: number, newValue: string) => {
        setRows(prev => {
            const target = [...prev];
            target[rowIndex][colIndex] = {
                ...target[rowIndex][colIndex],
                value: newValue,
            };
            return target;
        })
    }, [])

    const addRow = (value?: string) => {
        setRows(previous => {
            return [...previous,
                rows.length > 0 ? rows[rows.length - 1].map((_, index) => {
                    return {
                        id: `${columnLetters[index]}${rows.length}`,
                        value: value ? value : ''
                    }
                }) : [
                    {
                        id: `${columnLetters[rows.length]}${rows.length}`,
                        value: value ? value : ''
                    }
                ]
            ]
        });
    }

    const addColumn = (value?: string) => {
        setRows(() => {
            if (rows.length > 0) {
                return rows.map((row, index) => {
                    return [
                        ...row,
                        {
                            id: `${columnLetters[row.length]}${index}`,
                            value: value ? value : ''
                        }
                    ]
                })
            } else {
                return [[{
                    id: `${columnLetters[rows.length]}${rows.length}`,
                    value: value ? value : ''
                }]]
            }
        });
    }

    const removeRow = () => {
        setRows(() => {
            if (rows.length > 0) {
                return rows.slice(0, rows.length - 1);
            } else {
                return [];
            }
        })
    }

    const removeColumn = () => {
        setRows(() => {
            return rows.map(row => {
                if (row.length > 0) {
                    return row.slice(0, row.length - 1);
                }
                return row;
            })
        })
    }

    return {
        rows: rows.toSpliced(0, 1),
        columns: rows.toSpliced(1, rows.length)[0],
        setRows,
        addRow,
        addColumn,
        removeRow,
        removeColumn,
        handleInputChange,
    }
}
export function useTableById ({ params }: {
    params: Promise<{ id: string }>
}) {
    const param = use(params);
    const id = param.id;
    const url = `http://localhost:3000/api/table/${id}`;
    const fetcher = async () => await fetch(url).then(r => r.json());
    const { data, error, isLoading } = useSWR(url, fetcher, {
        fallbackData: [],
    });
    const rows = data["rows"] !== undefined ? data["rows"].map((row: {
        [index: string]: unknown}) => {
        
        let field = [];
        for (const key in row) {
            if (key === "_num") continue;
            field.push({
                id: ``,
                value: `${row[key]}`,
            })
        }
        return field;
    }) : [];

    return {
        data: rows,
        error: error,
        isLoading: isLoading,
    }
}