"use client"
import { useCallback, useState } from "react";


export default function useSoftConstraints(initialState: {
    valuesInColumn: Map<string, Map<string, number>>,
    valuesInRow: Map<string, Map<string, number>>,
} = { valuesInColumn: new Map(), valuesInRow: new Map() }) {
    /*
        Map<string, Map<string,number>>
        Map< row/column name, Map< value name, count >>
    */
    // Use X value N times in <Y column>
    const [valuesInColumns, setValuesInColumns] = useState<Map<string, Map<string, number>>>(initialState.valuesInColumn);
    // Use X values in <Y row>
    const [valuesInRows, setValuesInRows] = useState<Map<string, Map<string, number>>>(initialState.valuesInRow);

    const addColumnToMap = useCallback((column: string) => {
        setValuesInColumns(prev => {
            const newState = new Map(Array.from(prev));
            newState.set(column, new Map());
            return newState;
        });
    }, []);
    const addRowToMap = useCallback((row: string) => {
        setValuesInRows(prev => {
            const newState = new Map(Array.from(prev));
            newState.set(row, new Map());
            return newState;
        });
    }, []);
    const editColumnNameInMap = useCallback((previousName: string, newName: string) => {
        setValuesInColumns(prev => {
            const newState = new Map(Array.from(prev));
            if (!newState.has(previousName)) {
                return newState;
            } else {
                const previousMapFromColumn = newState.get(previousName);
                newState.set(newName, previousMapFromColumn ?? new Map());
                newState.delete(previousName);
                return newState;
            }
        });
    }, []);
    const editRowNameInMap = useCallback((previousName: string, newName: string) => {
        setValuesInRows(prev => {
            const newState = new Map(Array.from(prev));
            if (!newState.has(previousName)) {
                return newState;
            } else {
                const previousMapFromRow = newState.get(previousName);
                newState.set(newName, previousMapFromRow ?? new Map());
                newState.delete(previousName);
                return newState;
            }
        });
    }, []);
    const deleteColumnInMap = useCallback((column: string) => {
        setValuesInColumns(prev => {
            const newState = new Map(Array.from(prev));
            if (!newState.has(column)) {
                return newState;
            } else {
                newState.delete(column);
                return newState;
            }
        })
    }, []);
    const deleteRowInMap = useCallback((row: string) => {
        setValuesInRows(prev => {
            const newState = new Map(Array.from(prev));
            if (!newState.has(row)) {
                return newState;
            } else {
                newState.delete(row);
                return newState;
            }
        })
    }, []);
    const addValueToColumn = useCallback((column: string | "all", value: string, count: number) => {
        if (column === "all") {
            setValuesInColumns(prev => {
                // Convert Map to Array and iterate each name:Map pair
                const newState = Array.from(prev).map(([colName, valuesMap], index) => {
                    // Create new Map from previous Map containing the value:count pairs
                    const newMap = new Map(Array.from(valuesMap));
                    // Set the new value:count pair
                    newMap.set(value, count);
                    // Return the destructured key:value pair with the new Map
                    return [colName, newMap] as [string, Map<string, number>];
                });
                // Return a newly created Map from the Array
                return new Map(newState);
            });
        } else {
            setValuesInColumns(prev => {
                // Check if the main Map has the column as key
                if (prev.has(column)) {
                    // Convert previous Map to an Array and iterate through each name:Map pair
                    const newState = Array.from(prev).map(([colName, valuesMap]) => {
                        // Check if the current key is the same as the name being searched
                        if (column === colName) {
                            // If the name and the current key are the same
                            // create a new values' Map
                            const newMap = new Map(Array.from(valuesMap));
                            // Set the new value:count pair
                            newMap.set(value, count);
                            // Return the value:count pair
                            return [colName, newMap] as [string, Map<string, number>];
                        }
                        // If the name and the current key are not the same, return the same key:value pair
                        return [colName, valuesMap] as [string, Map<string, number>];
                    });
                    // Return a newly created Map
                    return new Map(newState);
                } else {
                    // If the main Map doesn't have the column being searched, return the
                    // previous Map in a newly created one
                    return new Map(Array.from(prev));
                }
            });
        }
    }, []);
    const addValueToRow = useCallback((row: string | "all", value: string, count: number) => {
        if (row === "all") {
            setValuesInRows(prev => {
                // Convert Map to Array and iterate each name:Map pair
                let newState = Array.from(prev).map(([rowName, valuesMap], index) => {
                    // Create new Map from previous Map containing the value:count pairs
                    const newMap = new Map(Array.from(valuesMap));
                    // Set the new value:count pair
                    newMap.set(value, count);
                    // Return the destructured key:value pair with the new Map
                    return [rowName, newMap] as [string, Map<string, number>]
                });
                // Return a newly created Map from the Array
                return new Map(newState);
            });
        } else {
            setValuesInRows(prev => {
                // Check if the main Map has the row as key
                if (prev.has(row)) {
                    // Convert previous Map to an Array and iterate through each name:Map pair
                    const newState = Array.from(prev).map(([rowName, valuesMap]) => {
                     // Check if the current key is the same as the name being searched
                        if (row === rowName) {
                            // If the name and the current key are the same
                            // create a new values' Map
                            const newMap = new Map(Array.from(valuesMap));
                            // Set the new value:count pair
                            newMap.set(value, count);
                            // Return the value:count pair
                            return [rowName, newMap] as [string, Map<string, number>];
                        }
                        // If the name and the current key are not the same, return the same key:value pair
                        return [rowName, valuesMap] as [string, Map<string, number>];
                    });
                    // Return a newly created Map
                    return new Map(newState);
                } else {
                    // If the main Map doesn't have the row being searched, return the
                    // previous Map in a newly created one
                    return new Map(Array.from(prev));
                }
            });
        }
    }, []);
    const editCountInColumn = useCallback((column: string, value: string, count: number) => {
        setValuesInColumns(prev => {
            if (prev.has(column)) {
                // Convert main Map into Array
                const previousMap = Array.from(prev).map(([colName, valsMap]) => {
                    if (column === colName) {
                        // Create new Map from the previous values' Map
                        const newValsMap = new Map(Array.from(valsMap));
                        // Set new count to value
                        newValsMap.set(value, count);
                        return [colName, newValsMap] as [string, Map<string, number>];
                    } else {
                        return [colName, valsMap] as [string, Map<string, number>];
                    }
                });
                return new Map(previousMap);
            } else {
                return prev;
            }
        });
    }, []);
    const editCountInRow = useCallback((row: string, value: string, count: number) => {
        setValuesInRows(prev => {
            if (prev.has(row)) {
                // Convert main Map into Array
                const previousMap = Array.from(prev).map(([rowName, valsMap]) => {
                    if (row === rowName) {
                        // Create new Map from the previous values' Map
                        const newValsMap = new Map(Array.from(valsMap));
                        // Set new count to value
                        newValsMap.set(value, count);
                        return [rowName, newValsMap] as [string, Map<string, number>];
                    } else {
                        return [rowName, valsMap] as [string, Map<string, number>];
                    }
                });
                return new Map(previousMap);
            } else {
                return prev;
            }
        });
    }, []);
    const deleteValueInColumn = useCallback((column: string | "all", value: string) => {
        if (column === "all") {
            setValuesInColumns(prev => {
                const previousMap = Array.from(prev).map(([colName, valsMap]) => {
                    const newValsMap = new Map(Array.from(valsMap));
                    newValsMap.delete(value);
                    return [colName, newValsMap] as [string, Map<string, number>];
                });
                return new Map(previousMap);
            });
        } else {
            setValuesInColumns(prev => {
                if (prev.has(column)) {
                    // Convert main Map into Array
                    const previousMap = Array.from(prev).map(([colName, valsMap]) => {
                        if (column === colName) {
                            // Create new Map from the previous values' Map
                            const newValsMap = new Map(Array.from(valsMap));
                            // Delete value
                            newValsMap.delete(value);
                            return [colName, newValsMap] as [string, Map<string, number>];
                        } else {
                            return [colName, valsMap] as [string, Map<string, number>];
                        }
                    });
                    return new Map(previousMap);
                } else {
                    return prev;
                }
            });
        }
    }, []);
    const deleteValueInRow = useCallback((row: string | "all", value: string) => {
        if (row === "all") {
            setValuesInRows(prev => {
                const previousMap = Array.from(prev).map(([rowName, valsMap]) => {
                    const newValsMap = new Map(Array.from(valsMap));
                    newValsMap.delete(value);
                    return [rowName, newValsMap] as [string, Map<string, number>];
                });
                return new Map(previousMap);
            });
        } else {
            setValuesInRows(prev => {
                if (prev.has(row)) {
                    // Convert main Map into Array
                    const previousMap = Array.from(prev).map(([rowName, valsMap]) => {
                        if (row === rowName) {
                            // Create new Map from the previous values' Map
                            const newValsMap = new Map(Array.from(valsMap));
                            // Delete value
                            newValsMap.delete(value);
                            return [rowName, newValsMap] as [string, Map<string, number>];
                        } else {
                            return [rowName, valsMap] as [string, Map<string, number>];
                        }
                    });
                    return new Map(previousMap);
                } else {
                    return prev;
                }
            });
        }
    }, []);

    return {
        valuesInColumns,
        valuesInRows,
        addColumnToMap,
        addRowToMap,
        editColumnNameInMap,
        editRowNameInMap,
        deleteColumnInMap,
        deleteRowInMap,
        addValueToColumn,
        addValueToRow,
        editCountInColumn,
        editCountInRow,
        deleteValueInColumn,
        deleteValueInRow,
    }
}
