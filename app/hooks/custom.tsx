import { useState } from "react"

export function useHTMLTable () {
    const [ rows, setRows ] = useState<Array<Array<{id: string, value: string}>>>([]);
    const columnLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    const addRow = (value?: string) => {
        setRows(previous => {
            return [...previous,
                rows.length > 0 ? rows[rows.length - 1].map((_, index) => {
                    return {
                        id: `${columnLetters[index]}${rows.length + 1}`,
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
            return rows.map((row, index) => {
                return [
                    ...row,
                    {
                        id: `${columnLetters[row.length]}${index}`,
                        value: value ? value : ''
                    }
                ]
            })
        });
    }

    const removeRow = () => {
        setRows(() => {
            if (rows.length) {
                return rows.toSpliced(0, rows.length - 1);
            } else {
                return [];
            }
        })
    }

    const removeColumn = () => {
        setRows(() => {
            return rows.map(row => {
                return row.toSpliced(0, row.length - 1);
            })
        })
    }

    return {
        addRow,
        addColumn,
        removeRow,
        removeColumn,
        rows,
    }
}