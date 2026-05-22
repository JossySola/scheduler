import { describe, expect, test } from "vitest";
import { act, renderHook } from "@testing-library/react";
import useRows from "@/lib/custom-hooks/use-rows";
import useValues from "@/lib/custom-hooks/use-table-values";
import useHeaderType from "@/lib/custom-hooks/use-header-type";
import useHardConstraints from "@/lib/custom-hooks/use-hard-constraints";
import useSoftConstraints from "@/lib/custom-hooks/use-soft-constraints";

describe("Custom React hooks", () => {
    describe.skip("useRows", () => {
        test("initializes with a Map", () => {
            const { result } = renderHook(() => useRows());
            expect(result.current.rows).toEqual(new Map());
        });
        test("enables adding a row", () => {
            const { result } = renderHook(() => useRows());
            // Confirms adding a row in an empty Map            
            act(() => result.current.addRow("123"));

            const firstRow = new Map(); // <"A":"">
            firstRow.set("A", "");
            const firstMap = new Map(); // <"123": Map>
            firstMap.set("123", firstRow);
            expect(result.current.rows).toEqual(firstMap);

            // Confirms adding a second row in a populated Map
            act(() => result.current.addRow("456"));

            const secondRow = new Map(); // <"A":"">
            secondRow.set("A", "");
            const secondMap = new Map(); // <"123": Map, "456", Map>
            secondMap.set("123", firstRow);
            secondMap.set("456", secondRow);
            expect(result.current.rows).toEqual(secondMap);
        });
        test("enables adding a column", () => {
            const { result } = renderHook(() => useRows());
            act(() => result.current.addRow("123"));
            act(() => result.current.addCol());

            const row = new Map();
            row.set("A", "");
            row.set("B", "");
            const map = new Map();
            map.set("123", row);

            expect(result.current.rows).toEqual(map);            
        });
        test("enables deleting a row", () => {
            const { result } = renderHook(() => useRows());
            act(() => result.current.addRow("123"));
            act(() => result.current.addRow("456"));
            const firstRow = new Map();
            firstRow.set("A", "");
            const secondRow = new Map();
            secondRow.set("A", "");
            const map = new Map();
            map.set("123", firstRow);
            map.set("456", secondRow);

            expect(result.current.rows).toEqual(map);
            act(() => result.current.deleteRow("456"));
            map.delete("456");
            expect(result.current.rows).toEqual(map);
        });
        test("enables editing specific cell", () => {
            const { result } = renderHook(() => useRows());

            act(() => result.current.addRow("123"));
            const initialRow = new Map();
            initialRow.set("A", "");
            const initialMap = new Map();
            initialMap.set("123", initialRow);
            expect(result.current.rows).toEqual(initialMap);

            act(() => result.current.editRow("123", "A", "test"));
            const editedRow = new Map();
            editedRow.set("A", "test");
            const editedMap = new Map();
            editedMap.set("123", editedRow);
            expect(result.current.rows).toEqual(editedMap);
        });
    });
    describe.skip("useValues", () => {
        test("enables adding a value", () => {
            const { result } = renderHook(() => useValues());
            act(() => result.current.addValue("test"));

            const expected = new Set();
            expected.add("test");

            expect(result.current.values).toEqual(expected);
        });
        test("enables deleting a value", () => {
            const { result } = renderHook(() => useValues());
            act(() => result.current.addValue("test"));
            const expected = new Set();
            expected.add("test");
            expect(result.current.values).toEqual(expected);
            act(() => result.current.deleteValue("test"));
            const deleted = new Set();
            expect(result.current.values).toEqual(deleted);
        });
        test("enables editing a value", () => {
            const { result } = renderHook(() => useValues());
            act(() => result.current.addValue("test"));
            const expected = new Set();
            expected.add("test");
            expect(result.current.values).toEqual(expected);
            act(() => result.current.editValue("test", "edited"));
            const edited = new Set();
            edited.add("edited");
            expect(result.current.values).toEqual(edited);
        });
    });
    describe.skip("useHeaderType", () => {
        test("enables changing the headers type and returns true", async () => {
            const { result } = renderHook(() => useHeaderType());
            expect(result.current.type).toEqual("text");
            const type = await act(() => result.current.changeType("date"));
            expect(result.current.type).toEqual("date");
            expect(type).toBe(true);
        });
        test("returns false if the type passed is invalid and prevents the change", async () => {
            const { result } = renderHook(() => useHeaderType());
            const type = await act(() => result.current.changeType("location"));
            expect(type).toBe(false);
            expect(result.current.type).toEqual("text");
        });
    });
    describe.skip("useHardConstraints", () => {
        test("adds disabled row into Set", () => {
            const { result } = renderHook(() => useHardConstraints());
            act(() => result.current.disableRow("123"));
            const expectedSet = new Set();
            expectedSet.add("123")
            expect(result.current.disabledRows).toEqual(expectedSet);
        });
        test("adds disabled column into Set", () => {
            const { result } = renderHook(() => useHardConstraints());
            act(() => result.current.disableColumn("A"));
            const expectedSet = new Set();
            expectedSet.add("A")
            expect(result.current.disabledColumns).toEqual(expectedSet);
        });
        test("deletes row item from Set", () => {
            const { result } = renderHook(() => useHardConstraints());
            act(() => result.current.disableRow("123"));
            const expectedSet = new Set();
            expectedSet.add("123")
            expect(result.current.disabledRows).toEqual(expectedSet);
            act(() => result.current.enableRow("123"));
            expect(result.current.disabledRows).toEqual(new Set());
        });
        test("deletes column item from Set", () => {
            const { result } = renderHook(() => useHardConstraints());
            act(() => result.current.disableColumn("A"));
            const expectedSet = new Set();
            expectedSet.add("A")
            expect(result.current.disabledColumns).toEqual(expectedSet);
            act(() => result.current.enableColumn("A"));
            expect(result.current.disabledColumns).toEqual(new Set());
        });
    });
    describe.skip("useSoftConstraints", () => {
        describe("Use X value N times in <Y column> (valuesInColumn)", () => {
            test("enables adding a value constraint into a column", () => {
                const { result } = renderHook(() => useSoftConstraints());
                act(() => result.current.addValueInColumn("test", 1, "A"));
                const expectedValuesMap = new Map();
                expectedValuesMap.set("test", 1);
                const expectedColsMap = new Map();
                expectedColsMap.set("A", expectedValuesMap);
                expect(result.current.valuesInColumn).toEqual(expectedColsMap);
            });
            test("enables editing count in column", () => {
                const { result } = renderHook(() => useSoftConstraints());
                act(() => result.current.addValueInColumn("test", 1, "A"));
                act(() => result.current.editCountInColumn("test", 10, "A"));
                const expectedValuesMap = new Map();
                expectedValuesMap.set("test", 10);
                const expectedMap = new Map();
                expectedMap.set("A", expectedValuesMap);
                expect(result.current.valuesInColumn).toEqual(expectedMap);
            });
            test("when editing, if there is no previous count, it creates a new count", () => {
                const { result } = renderHook(() => useSoftConstraints());
                act(() => result.current.editCountInColumn("test", 10, "A"));
                const expectedValuesMap = new Map();
                expectedValuesMap.set("test", 10);
                const expectedMap = new Map();
                expectedMap.set("A", expectedValuesMap);
                expect(result.current.valuesInColumn).toEqual(expectedMap);
            });
            test("enables deleting a value constraint", () => {
                const { result } = renderHook(() => useSoftConstraints());
                act(() => result.current.addValueInColumn("test", 1, "A"));
                const expectedValuesMap = new Map();
                expectedValuesMap.set("test", 1);
                const expectedColsMap = new Map();
                expectedColsMap.set("A", expectedValuesMap);
                expect(result.current.valuesInColumn).toEqual(expectedColsMap);

                act(() => result.current.deleteCountInColumn("test", "A"));
                const valuesAfterDeletion = new Map();
                const mapAfterDeletion = new Map();
                mapAfterDeletion.set("A", valuesAfterDeletion);
                expect(result.current.valuesInColumn).toEqual(mapAfterDeletion);
            });
            test("returns current value constraints if value is not found when deleting", () => {
                const { result } = renderHook(() => useSoftConstraints());
                act(() => result.current.addValueInColumn("test", 1, "A"));
                const expectedValuesMap = new Map();
                expectedValuesMap.set("test", 1);
                const expectedColsMap = new Map();
                expectedColsMap.set("A", expectedValuesMap);
                expect(result.current.valuesInColumn).toEqual(expectedColsMap);

                act(() => result.current.deleteCountInColumn("bug", "A"));
                expect(result.current.valuesInColumn).toEqual(expectedColsMap);
            });
        });
        describe("Use X values in <Y row> (valuesInRow)", () => {
            test("enables adding a value constraint into a row", () => {
                const { result } = renderHook(() => useSoftConstraints());
                act(() => result.current.addValueInRow("test", "123"));
                const expectedSet = new Set();
                expectedSet.add("test");
                const expectedMap = new Map();
                expectedMap.set("123", expectedSet);
                expect(result.current.valuesInRow).toEqual(expectedMap); 
            });
            test("enables editing value constraint in row", () => {
                const { result } = renderHook(() => useSoftConstraints());
                act(() => result.current.addValueInRow("test", "123"));
                const expectedSet = new Set();
                expectedSet.add("test");
                const expectedMap = new Map();
                expectedMap.set("123", expectedSet);
                expect(result.current.valuesInRow).toEqual(expectedMap); 

                act(() => result.current.editValueInRow("test", "bug", "123"));
                const editedSet = new Set();
                editedSet.add("bug");
                const editedMap = new Map();
                editedMap.set("123", editedSet);
                expect(result.current.valuesInRow).toEqual(editedMap);
            });
            test("if editing a non existent value, adds the value", () => {
                const { result } = renderHook(() => useSoftConstraints());
                act(() => result.current.addValueInRow("test", "123"));
                const expectedSet = new Set();
                expectedSet.add("test");
                const expectedMap = new Map();
                expectedMap.set("123", expectedSet);
                expect(result.current.valuesInRow).toEqual(expectedMap); 

                act(() => result.current.editValueInRow("test2", "bug", "123"));
                const editedSet = new Set();
                editedSet.add("test");
                editedSet.add("bug");
                const editedMap = new Map();
                editedMap.set("123", editedSet);
                expect(result.current.valuesInRow).toEqual(editedMap);
            });
            test("enables deleting a value constraint in a row", () => {
                const { result } = renderHook(() => useSoftConstraints());
                act(() => result.current.addValueInRow("test", "123"));
                const expectedSet = new Set();
                expectedSet.add("test");
                const expectedMap = new Map();
                expectedMap.set("123", expectedSet);
                expect(result.current.valuesInRow).toEqual(expectedMap); 

                act(() => result.current.deleteValueInRow("test", "123"));
                const mapAfterDeletion = new Map();
                mapAfterDeletion.set("123", new Set());
                expect(result.current.valuesInRow).toEqual(mapAfterDeletion);
            });
            test("returns current map when deleting a non existent value", () => {
                const { result } = renderHook(() => useSoftConstraints());
                act(() => result.current.addValueInRow("test", "123"));
                const expectedSet = new Set();
                expectedSet.add("test");
                const expectedMap = new Map();
                expectedMap.set("123", expectedSet);
                expect(result.current.valuesInRow).toEqual(expectedMap); 

                act(() => result.current.deleteValueInRow("bug", "123"));
                expect(result.current.valuesInRow).toEqual(expectedMap);
            });
        });
    });
});