import useRows from "@/lib/custom-hooks/use-rows";
import { describe, expect, test } from "vitest";
import { act, renderHook } from "@testing-library/react";

describe("Custom React hooks", () => {
    describe("useRows", () => {
        test("initializes with an empty array", () => {
            const { result } = renderHook(() => useRows());
            expect(result.current.rows).toEqual([]);
        });
        test("enables adding a row", () => {
            const { result } = renderHook(() => useRows());
            // Confirms adding a row in an empty array            
            act(() => result.current.addRow());
            const expected1 = new Map();
            expected1.set("A", "");
            expect(result.current.rows).toEqual([
                expected1,
            ]);
            // Confirms adding a second row in a populated array
            act(() => result.current.addRow());
            const expected2 = new Map();
            expected2.set("A", "");
            expect(result.current.rows).toEqual([
                expected1,
                expected2,
            ]);
        });
        test("enables adding a column", () => {
            const { result } = renderHook(() => useRows());
            act(() => result.current.addRow());
            act(() => result.current.addCol());

            const expected = new Map();
            expected.set("A", "");
            expected.set("B", "");

            expect(result.current.rows).toEqual([
                expected,
            ])            
        });
        test("enables deleting a row", () => {
            const { result } = renderHook(() => useRows());
            act(() => result.current.addRow());
            act(() => result.current.addRow());
            const firstRow = new Map();
            firstRow.set("A", "");
            const secondRow = new Map();
            secondRow.set("A", "");
            expect(result.current.rows).toEqual([
                firstRow,
                secondRow,
            ]);
            act(() => result.current.deleteRow());
            expect(result.current.rows).toEqual([
                firstRow,
            ]);
        });
        test("enables getting a specific row", async () => {
            const { result } = renderHook(() => useRows());
            act(() => result.current.addRow());
            const firstRow = new Map();
            firstRow.set("A", "");
            const retrievedRow = await act(() => result.current.getRow(0));
            expect(retrievedRow).toEqual(firstRow);
        });
        test("returns undefined when retrieving a non existent row", async () => {
            const { result } = renderHook(() => useRows());
            act(() => result.current.addRow());
            const retrievedRow = await act(() => result.current.getRow(1));
            expect(retrievedRow).toBe(undefined);
        });
        test("enables editing specific cell", async () => {
            const { result } = renderHook(() => useRows());
            act(() => result.current.addRow());
            const cell = await act(() => result.current.editRow(0, "A", "test"));
            expect(cell).toBe(true);
        });
        test("returns false when editing non existent row / column", async () => {
            const { result } = renderHook(() => useRows());
            act(() => result.current.addRow());
            const firstAttempt = await act(() => result.current.editRow(1, "A", "test"));
            expect(firstAttempt).toBe(false);
            const secondAttempt = await act(() => result.current.editRow(0, "B", "test"));
            expect(secondAttempt).toBe(false);
        });
    });
});