import { vi, expect, describe, afterEach, beforeEach, test, beforeAll } from "vitest";
import * as Utils from "../../utils";
import pool from "../../mocks/db";
import { Argon2id } from "oslo/password";
import mockExposedPasswords from "../../mocks/mock-exposed-passwords";
import crypto, { Hash } from "crypto";

vi.mock(import("server-only"), () => ({}))
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
vi.mock("crypto", () => {
    return {
        default: {
            createHash: vi.fn(() => ({
                update: vi.fn().mockReturnThis(),
                digest: vi.fn().mockReturnValue("000F6468C6E4D09C0C239A4C2769501B3DD"),
            })),
        },
        randomBytes: vi.fn(() => Buffer.from("mock-bytes")),
    }
})
vi.mock("zod", () => {
    return {
        z: vi.fn(),
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
    describe("isPasswordPwned()", () => {
        // Context setup
        const mockText = new Blob([mockExposedPasswords], { type: "text/plain" })
        const mockResponse = new Response(mockText, {
            status: 200,
            headers: { 'Content-Type': 'text/plain' }
        });
        
        beforeEach(() => {
            global.fetch = vi.fn().mockResolvedValue(mockResponse);
            vi.spyOn(Response.prototype, "text").mockResolvedValue(mockExposedPasswords);
        })

        test("Creates SHA1 hash from the given password", async () => {
            // Setup
            const updateMock = vi.fn().mockReturnThis();
            const digestMock = vi.fn().mockReturnValue("mock-digest");
            const createHash = vi.spyOn(crypto, "createHash").mockReturnValue({
                update: updateMock,
                digest: digestMock,
            } as unknown as Hash)

            // Implementation
            await Utils.isPasswordPwned("password");

            // Result
            expect(createHash).toHaveBeenCalledTimes(1);
            expect(createHash).toHaveBeenCalledWith("sha1");
            expect(updateMock).toHaveBeenCalledWith("password");
            expect(digestMock).toHaveBeenCalledWith("hex");
            expect(createHash).toMatchSnapshot();
            expect(updateMock).toMatchSnapshot();
            expect(digestMock).toMatchSnapshot();
        })
        test("Slices hash to get the 'range'", async () => {
            // Setup
            const sliceSpy = vi.spyOn(String.prototype, "slice");

            // Implementation
            await Utils.isPasswordPwned("password");

            // Result
            expect(sliceSpy).toHaveBeenCalledWith(0,5);
            expect(sliceSpy).toMatchSnapshot();
        })
        test("Fetches from api.pwnedpasswords", async () => {
            // Setup
            const fetchSpy = vi.spyOn(global, "fetch");

            // Implementation
            await Utils.isPasswordPwned("password");

            // Result
            expect(fetchSpy).toHaveBeenCalledWith("https://api.pwnedpasswords.com/range/000F6");
            expect(fetchSpy).toMatchSnapshot();
        })
        test("Receives Response as 'text' and converts it to String with Response.text()", async () => {
            // Setup
            const spyOnResponse = vi.spyOn(Response.prototype, "text").mockResolvedValue(mockExposedPasswords);
            
            // Implementation
            await Utils.isPasswordPwned("password");

            // Result
            expect(spyOnResponse).toHaveBeenCalledTimes(1);
            expect(spyOnResponse).toHaveBeenCalledWith();
            expect(spyOnResponse).toHaveResolvedWith(mockExposedPasswords);
            expect(spyOnResponse).toMatchSnapshot();
        })
        describe("Splits String into substrings and returns them as an array", () => {
            test("Splits the substring on each linebreak (suffix)", async () => {
                //Setup
                const spyOnString = vi.spyOn(String.prototype, "split");

                // Implementation
                await Utils.isPasswordPwned("password");

                // Result
                expect(spyOnString).toHaveBeenCalledWith('\n');
                expect(spyOnString).toMatchSnapshot();
            })
            test("Splits the sub-substring on each colon (count)", async () => {
                //Setup
                const spyOnString = vi.spyOn(String.prototype, "split");

                // Implementation
                await Utils.isPasswordPwned("password");

                // Result
                expect(spyOnString).toHaveBeenCalledWith(':');
                expect(spyOnString).toMatchSnapshot();
            })
            test("Uses parseInt to return the count number if suffix to check is the same as the suffix being checked", async () => {
                //Setup
                const spyOnInt = vi.spyOn(global, "parseInt");

                // Implementation
                await Utils.isPasswordPwned("password");

                // Result
                expect(spyOnInt).toHaveBeenCalled();
                expect(spyOnInt).toMatchSnapshot();
            })
            test("Returns the count number greater than 0, which means the password has been exposed", async () => {
                // Setup

                // Implementation
                const result = await Utils.isPasswordPwned("password");

                // Result
                expect(result).toBe(789);
                expect(result).toMatchSnapshot();
            })
            test("Returns 0, which means the password is NOT exposed", async () => {
                // Setup
                vi.spyOn(crypto, 'createHash').mockReturnValue({
                    update: vi.fn().mockReturnThis(),
                    digest: vi.fn().mockReturnValue("000F6468C6E4D09C7A239A4C2769501B3DD"),
                } as unknown as crypto.Hash)
                
                // Implementation
                const result = await Utils.isPasswordPwned("password");

                // Result
                expect(result).toBe(0);
                expect(result).toMatchSnapshot();
            })
        })
    })
    describe("sendResetPasswordConfirmation()", () => {

    })
})