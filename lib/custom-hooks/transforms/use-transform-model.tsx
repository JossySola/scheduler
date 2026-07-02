'use client'
import { TableState } from "@/lib/definitions";
import { useState } from "react";

export default function useTransformModel(rows: TableState) {
    // Filtering, Sorting, Grouping, Visibility
    const [transformedTable, setTransformedTable] = useState<TableState>(rows);
    const [isSorted, setIsSorted] = useState<boolean>(false);
    const [isFiltered, setIsFiltered] = useState<boolean>(false);

    const getFilteredTable = (columnIndex: number, filter: string) => {
        // If removing the whitespace equals an empty string or the column does not exist, return the original rows
        if (filter.trim() === "" || !rows[columnIndex]) {
            setIsFiltered(false);
            return;
        };
        setTransformedTable(Array.from(rows).filter((row, index) => 
                index !== 0 
                && row[columnIndex]
                && row[columnIndex].includes(filter.trim())
        ));
        setIsFiltered(true);
    }
    const getSortedTable = (columnIndex: number, columnType: "text" | "date" | "time" | "number", dir: "asc" | "desc" = "asc") => {
        if (!rows[0] || columnIndex < 0 || columnIndex >= rows[0].length) {
            setIsSorted(false);
            return;
        }

        const getCellValue = (row: TableState[number]) => row[columnIndex]?.trim() ?? "";
        const compareText = (currentValue: string, nextValue: string) => currentValue.localeCompare(nextValue);
        const compareNumbers = (currentValue: number, nextValue: number) => currentValue - nextValue;
        const parseNumber = (value: string) => {
            if (value === "") return Number.POSITIVE_INFINITY;

            const parsedNumber = Number(value);
            return Number.isNaN(parsedNumber) ? Number.POSITIVE_INFINITY : parsedNumber;
        }
        const parseDate = (value: string) => {
            const parsedDate = new Date(value).getTime();
            return Number.isNaN(parsedDate) ? Number.POSITIVE_INFINITY : parsedDate;
        }
        const parseTime = (value: string) => {
            if (value === "") return Number.POSITIVE_INFINITY;

            const [hours = "0", minutes = "0", seconds = "0"] = value.split(":");
            const parsedTime = (Number(hours) * 60 * 60) + (Number(minutes) * 60) + Number(seconds);
            return Number.isNaN(parsedTime) ? Number.POSITIVE_INFINITY : parsedTime;
        }

        const sortedRows = Array.from(rows).toSorted((current, next) => {
            const currentCell = getCellValue(current);
            const nextCell = getCellValue(next);
            let result = 0;

            if (columnType === "text") {
                result = compareText(currentCell, nextCell);
            } else if (columnType === "number") {
                result = compareNumbers(parseNumber(currentCell), parseNumber(nextCell));
            } else if (columnType === "date") {
                result = compareNumbers(parseDate(currentCell), parseDate(nextCell));
            } else if (columnType === "time") {
                result = compareNumbers(parseTime(currentCell), parseTime(nextCell));
            }

            return dir === "asc" ? result : -result;
        });

        setTransformedTable(sortedRows);
        setIsSorted(true);
    }

    return {
        transformedTable,
        isSorted,
        isFiltered,
        getFilteredTable,
        getSortedTable,
    }
}
