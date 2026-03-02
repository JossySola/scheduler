import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from "vitest";
import { isPasswordPwned } from "../../utils";
import { server } from "../mocks/node";

describe("Server Utils", () => {
    describe("isPasswordPwned", () => {
        // 184456
        beforeAll(() => {
            vi.clearAllMocks();
            server.listen();
        });
        afterEach(() => server.resetHandlers());
        afterAll(() => server.close());
        test("returns greater than 0 if the password has been leaked", async () => {
            const result = await isPasswordPwned("184456");
            expect(result).toBeGreaterThan(0);
            expect(result).toMatchSnapshot();
        });
        test("returns 0 if the password has not been leaked", async () => {
            const result = await isPasswordPwned("Password");
            expect(result).toBe(0);
            expect(result).toMatchSnapshot();
        });
        test("returns object if function fails", async () => {
            const result = await isPasswordPwned("");
            expect(result).toEqual({
                message: "Unknown error from exposed password checking.",
                ok: false
            });
            expect(result).toMatchSnapshot();
        });
    });
});