import { describe, expect, test } from "vitest";
import getMultipleZodErrors from "../../utils/getMultipleZodErrors";
import z from "zod";

describe("Utils", () => {
    describe("getMultipleZodErrors", () => {
        test("returns string with Zod errors", () => {
            const str = z.string({ error: "Invalid string" }).safeParse(32);
            const num = z.int({ error: "Invalid number" }).safeParse("Error");
            const uuid = z.uuidv4({ error: "Invalid UUID" }).safeParse(null);

            const result = getMultipleZodErrors([str, num, uuid]);

            expect(typeof result).toBe("string");
        });
        test("returns null if there are no Zod errors", () => {
            const str = z.string({ error: "Invalid string" }).safeParse("Error");
            const num = z.number({ error: "Invalid number" }).safeParse(32);
            const boolean = z.boolean({ error: "Invalid boolean" }).safeParse(true);

            const result = getMultipleZodErrors([str, num, boolean]);
            expect(result).toBeNull();
        });
        test("returns string even if not all items have errors", () => {
            const str = z.string({ error: "Invalid string" }).safeParse("Error");
            const num = z.number({ error: "Invalid number" }).safeParse(32);
            const boolean = z.boolean({ error: "Invalid boolean" }).safeParse(null);

            const result = getMultipleZodErrors([str, num, boolean]);
            expect(typeof result).toBe("string");
        });
        test("returns null if the argument passed is not expected", () => {
            const result = getMultipleZodErrors();
            expect(result).toBeNull();
        });
    });
});