import useRows from "@/lib/custom-hooks/use-rows";
import { describe, expect, test } from "vitest";
import { act, renderHook } from "@testing-library/react";
import useValues from "@/lib/custom-hooks/use-table-values";
import useHeaderType from "@/lib/custom-hooks/use-header-type";

describe("Custom React hooks", () => {
    describe("useRows", () => {
        test.skip("initializes with a Map", () => {
            const { result } = renderHook(() => useRows());
            expect(result.current.rows).toEqual(new Map());
        });
        test.skip("enables adding a row", () => {
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
        test.skip("enables adding a column", () => {
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
        test.skip("enables deleting a row", () => {
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
        test.skip("enables editing specific cell", () => {
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
});