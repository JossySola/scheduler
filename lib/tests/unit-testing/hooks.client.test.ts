import { describe, expect, test } from "vitest";
import { act, renderHook } from "@testing-library/react";
import useRows from "@/lib/custom-hooks/use-rows";
import useValues from "@/lib/custom-hooks/constraints/use-table-values";
import useHeaderType from "@/lib/custom-hooks/constraints/use-header-type";
import useHardConstraints from "@/lib/custom-hooks/constraints/use-hard-constraints";
import useSoftConstraints from "@/lib/custom-hooks/constraints/use-soft-constraints";
import { TableState } from "@/lib/definitions";

describe("Custom React hooks", () => {
    describe("useRows", () => {
        test("initializes with an Array", () => {
            const { result } = renderHook(() => useRows());
            expect(result.current.rows).toEqual([]);
        });
        test("enables adding a row", () => {
            const { result } = renderHook(() => useRows());
            // Confirms adding a row in an empty Map            
            act(() => result.current.addRow());

            const rows: TableState = [];
            rows.push([""]);
            expect(result.current.rows).toEqual(rows);

            // Confirms adding a second row in a populated Map
            act(() => result.current.addRow());
            
            rows.push([""]);
            expect(result.current.rows).toEqual(rows);
        });
        test("enables adding a column", () => {
            const { result } = renderHook(() => useRows());
            act(() => result.current.addRow());
            act(() => result.current.addCol());

            const rows: TableState = [];
            rows.push(["", ""]);
            expect(result.current.rows).toEqual(rows);            
        });
        test("enables deleting a row", () => {
            const { result } = renderHook(() => useRows());
            act(() => result.current.addRow());
            act(() => result.current.addRow());
            
            const rows: TableState = [];
            rows.push([""], [""]);

            expect(result.current.rows).toEqual(rows);
            act(() => result.current.deleteRow());
            rows.pop();
            expect(result.current.rows).toEqual(rows);
        });
        test("enables deleting a specific row with index", () => {
            const { result } = renderHook(() => useRows());
            act(() => result.current.addRow());
            act(() => result.current.addRow());
            act(() => result.current.addRow());
            
            const rows: TableState = [];
            rows.push([""], [""], [""]);

            expect(result.current.rows).toEqual(rows);
            act(() => result.current.deleteRow(1));
            rows.splice(1,1);
            expect(result.current.rows).toEqual(rows);
        });
        test("enables deleting a column", () => {
            const { result } = renderHook(() => useRows());
            act(() => result.current.addRow());
            act(() => result.current.addCol());

            // First verifies adding columns is enabled
            let rows: TableState = [];
            rows.push(["", ""]);
            expect(result.current.rows).toEqual(rows);

            // Now we will verify that we can delete a column
            act(() => result.current.deleteColumn());
            rows = [[""]];
            expect(result.current.rows).toEqual(rows);
        });
        test("enables deleting a specific column", () => {
            const { result } = renderHook(() => useRows());
            act(() => result.current.addRow());
            act(() => result.current.addCol());
            act(() => result.current.addCol());

            // First verifies adding columns is enabled
            const rows: TableState = [];
            rows.push(["", "", ""]);
            expect(result.current.rows).toEqual(rows);

            // Now we will verify that we can delete a column
            act(() => result.current.deleteColumn(1));
            rows[0].splice(1,1);
            expect(result.current.rows).toEqual(rows);
        });
        test("enables editing a header's value", () => {
            const { result } = renderHook(() => useRows());
            act(() => result.current.addRow());
            act(() => result.current.addCol());
            act(() => result.current.addCol());
            act(() => result.current.editCell({
                rowIndex: 0,
                colIndex: 1,
                value: "test"
            }));
            
            const rows: TableState = [];
            const defaultHeader = "";
            rows.push([defaultHeader, "test", defaultHeader]);

            expect(result.current.rows).toEqual(rows);
        });
    });
    describe("useValues", () => {
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
    describe("useHardConstraints", () => {
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
    describe("useSoftConstraints", () => {
        describe("Use X value N times in <Y column> (valuesInColumn)", () => {
            test("enables adding a value constraint into a column", () => {
                const { result } = renderHook(() => useSoftConstraints());
            });
            test("enables editing count in column", () => {
                const { result } = renderHook(() => useSoftConstraints());
            });
            test("when editing, if there is no previous count, it creates a new count", () => {
                const { result } = renderHook(() => useSoftConstraints());
            });
            test("enables deleting a value constraint", () => {
                const { result } = renderHook(() => useSoftConstraints());
            });
            test("returns current value constraints if value is not found when deleting", () => {
                const { result } = renderHook(() => useSoftConstraints());
            });
        });
        describe("Use X values in <Y row> (valuesInRow)", () => {
            test("enables adding a value constraint into a row", () => {
                const { result } = renderHook(() => useSoftConstraints());
            });
            test("enables editing value constraint in row", () => {
                const { result } = renderHook(() => useSoftConstraints());
            });
            test("if editing a non existent value, adds the value", () => {
                const { result } = renderHook(() => useSoftConstraints());
            });
            test("enables deleting a value constraint in a row", () => {
                const { result } = renderHook(() => useSoftConstraints());
            });
            test("returns current map when deleting a non existent value", () => {
                const { result } = renderHook(() => useSoftConstraints());
            });
        });
    });
});