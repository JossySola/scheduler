import { vi, expect, describe, afterEach, test } from "vitest";
import * as Utils from "../../utils";
import pool from "../../mocks/db";
import { Argon2id } from "oslo/password";
import { verify } from "crypto";

vi.mock(import("server-only"), () => ({}))
/*
 vi.mock is hoisted. In this case it mocks the module "../../mocks/db" before
 it is imported. Visually, vi.mock would be placed first before the imports
 above. After that, the "import pool from '../../mocks/db';" will be already mocked.

 In this case, "pool" is exported as default (pool instead of { pool }), the factory
 object has to return an object with a 'default' property. As I understand it, the 
 property "default" references "pool", and inside the property I can mock the "query" 
 method the real pool class has.

 Test example:
    // Setup
    vi.mocked(pool.query).mockImplementationOnce(() => ({ id: 1}));

    // Implementation
    pool.query(`SELECT * FROM users;`);

    // Result
    expect(pool.query).toBeCalled()
    expect(pool.query).toReturnWith({ id: 1 })

    Test passes ✅
*/
vi.mock("../../mocks/db.ts", () => {
    return {
        default: { // References "pool"
            query: vi.fn() // Mocks pool method
        }
    }
})
vi.mock("oslo/password", () => {
    return {
        Argon2id: vi.fn(() => ({ 
            verify: vi.fn().mockResolvedValue(true) 
        }))
    }
})
describe("<utils.ts>", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    })
    describe("getUserFromDb()", () => {
        describe("Checks missing data...", () => {
            test("If data is missing, returns message", async () => {
                // Setup
                const expected = {
                    message: "Data missing",
                    provider: "",
                    ok: false,
                }
    
                // Implementation
                const result = await Utils.getUserFromDb();
    
                // Result
                expect(result).toMatchSnapshot();
                expect(result).toEqual(expected);
            })
        })
        describe("If user exists...", () => {
            test("Fetches user data from database", async () => {
                // Setup
                const username = "John Doe";
                const password = "j6Y4M8U{";
                const expected = {
                    id: "1",
                    name: "John Doe",
                    username: "John Doe",
                    email: "john@doe.com",
                    role: "user",
                    message: "",
                    ok: true,
                }
                const query = pool.query as jest.Mock;
                vi.mocked(query).mockResolvedValueOnce({
                    rowCount: 1,
                    rows: [{
                        id: "1",
                        name: "John Doe",
                        username: "John Doe",
                        email: "john@doe.com",
                        role: "user",
                        message: "",
                        ok: true,
                    }]
                });
    
                // Implementation
                const result = await Utils.getUserFromDb(username, password);
    
                // Result
                expect(pool.query).toHaveBeenCalledOnce();
                expect(result).toMatchSnapshot();
                expect(result).toEqual(expected);
            })
            test("Verifies password against hashed password", async () => {
                // Setup
                const username = "John Doe";
                const password = "j6Y4M8U{";

                // Implementation
                const query = pool.query as jest.Mock;
                vi.mocked(query).mockResolvedValueOnce({
                    rowCount: 1,
                    rows: [{
                        id: "1",
                        name: "John Doe",
                        username: "John Doe",
                        email: "john@doe.com",
                        role: "user",
                        password: "j6Y4M8U{"
                    }]
                })
                const result = await Utils.getUserFromDb(username, password);

                // Result
                expect(pool.query).toHaveBeenCalledOnce();
                expect(result).toMatchSnapshot();
                expect(result).toEqual({
                    id: "1",
                    name: "John Doe",
                    username: "John Doe",
                    email: "john@doe.com",
                    role: "user",
                    message: "",
                    ok: true,
                })
            })
            test("Throws error and returns object if password verification failed", async () => {
                // Setup
                const username = "John Doe";
                const password = "j6Y4M8U{";

                // Implementation
                const query = pool.query as jest.Mock;
                vi.mocked(query).mockResolvedValueOnce({
                    rowCount: 1,
                    rows: [{
                        id: "1",
                        name: "John Doe",
                        username: "John Doe",
                        email: "john@doe.com",
                        role: "user",
                        password: "j6Y4M8U{"
                    }]
                })
                
                vi.mocked(Argon2id).mockImplementation(() => ({
                    verify: vi.fn().mockResolvedValueOnce(false)
                }) as any);
                const result = await Utils.getUserFromDb(username, password);
                
                // Result
                expect(result).toEqual({ message: "Invalid credentials", ok: false })
            })
        })
        describe("If user does NOT exist...", () => {
            test("Returns message", async () => {
                // Setup
                const username = "John Doe";
                const password = "j6Y4M8U{";
                const expected = {
                    message: "User not found",
                    provider: "",
                    ok: false,
                }
                const query = pool.query as jest.Mock;
                vi.mocked(query).mockResolvedValueOnce({
                    rowCount: 0
                })
    
                // Implementation
                const result = await Utils.getUserFromDb(username, password);
    
                // Result
                expect(pool.query).toHaveBeenCalledTimes(1);
                expect(result).toMatchSnapshot();
                expect(result).toEqual(expected);
            })
        })
        describe("If user exists BUT password is null...", () => {
            test("Returns message and the signup provider (Google | Facebook)", async () => {
                // Setup
                const username = "John Doe";
                const password = "j6Y4M8U{";
                
                // Implementation
                const query = pool.query as jest.Mock;
                vi.mocked(query).mockResolvedValueOnce({
                    rowCount: 1,
                    rows: [{
                        password: null,
                        email: "john@doe.com"
                    }]
                })
                vi.mocked(query).mockResolvedValueOnce({
                    rowCount: 1,
                    rows: ["Google"]
                })
                const result = await Utils.getUserFromDb(username, password);
    
                // Result
                expect(result).toMatchSnapshot();
                expect(result).toEqual({
                    message: "This account uses Google authentication.",
                    provider: "Google",
                    ok: false,
                })
    
            })
        })
    })
})