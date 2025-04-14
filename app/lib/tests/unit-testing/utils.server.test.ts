import { vi, expect, describe, afterEach, beforeEach, test } from "vitest";
import * as Utils from "../../utils";
import pool from "../../mocks/db";
import { Argon2id } from "oslo/password";
import mockExposedPasswords from "../../mocks/mock-exposed-passwords";
import crypto, { Hash, randomBytes } from "crypto";
import sgMail from "@sendgrid/mail";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";
import { DecryptCommand, KMSClient } from "@aws-sdk/client-kms";
import fetch from "node-fetch"

vi.mock(import("server-only"), () => ({}))
vi.mock("../../mocks/db.ts", () => {
    return {
        default: { // References "pool"
            query: vi.fn()
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
            createDecipheriv: vi.fn(() => ({
                update: vi.fn().mockReturnThis(),
            }))
        },
        randomBytes: vi.fn(() => Buffer.from("mock-bytes")),
    }
})
vi.mock("zod", () => {
    return {
        z: {
            string: vi.fn(() => ({
                min: vi.fn(num => ({
                    email: vi.fn(options => ({
                        safeParse: vi.fn(email => {
                            if (!email || email.length < num) {
                                return options
                            }
                            if (!email.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i)) {
                                return {
                                    "success": false,
                                    "error": {
                                        "issues": [
                                            {
                                                code: "invalid_string",
                                                message: options.message,
                                                path: [],
                                                validation: "email"
                                            }
                                        ]
                                    }
                                };
                            }
                            return { success: true, data: email };
                        })
                    }))
                }))
            }))
        }
    }
})
vi.mock("@sendgrid/mail", () => {
    return {
        default: {
            setApiKey: vi.fn().mockImplementation(() => {}),
            send: vi.fn().mockResolvedValueOnce([{
                statusCode: 202,
                body: Response,
                headers: {}
            }, {}]),
        }
    }
})

describe("<utils.ts>", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    })
    beforeEach(() => {
        vi.mocked(pool.query).mockResolvedValue({
            rowCount: 1,
            rows: [],
        } as unknown as ReturnType<typeof pool.query>);
        vi.mocked(sgMail.send).mockResolvedValue([{
            statusCode: 202,
            body: Response,
            headers: {}
        }, {}]);
        process.env.SENDGRID_API_KEY = "XXXYYYZZZ";
    })
    describe.skip("getUserFromDb()", () => {
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
    describe.skip("isPasswordPwned()", () => {
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
    describe.skip("sendResetPasswordConfirmation()", () => {
        test("If data is missing, returns object", async () => {
            // Setup
            // Implementation
            const result = await Utils.sendResetPasswordConfirmation();
            // Result
            expect(result).toEqual({
                ok: false,
                message: 'Email must be provided'
            });
            expect(result).toMatchSnapshot();
        })
        test("If email is invalidated by Zod, returns object", async () => {
            // Setup
            const invalidEmail = "invalid/email";

            // Implementation
            const result = await Utils.sendResetPasswordConfirmation(invalidEmail);
            
            // Result
            expect(result).toEqual({
                ok: false,
                message: "Invalid e-mail"
            })
            expect(result).toMatchSnapshot();
        })
        test("If email is not found on database, returns object", async () => {
            // Setup
            vi.mocked(pool.query).mockResolvedValueOnce({
                rowCount: 0,
                rows: []
            } as unknown as ReturnType<typeof pool.query>);

            // Implementation
            const result = await Utils.sendResetPasswordConfirmation("name@domain.com");

            // Result
            expect(result).toEqual({
                ok: false,
                message: "Email not found"
            })
            expect(result).toMatchSnapshot();
        })
        test("Generates random token in base64 with a length of 6 characters", async () => {
            // Setup

            // Implementation
            const result = await Utils.sendResetPasswordConfirmation("name@domain.com");

            // Result
            expect(randomBytes).toHaveBeenCalledTimes(1);
            expect(result).toMatchSnapshot();
        })
        test("Sets API .env key to @sendgrid/mail (Twilio)", async () => {
            // Setup

            // Implementation
            const result = await Utils.sendResetPasswordConfirmation("name@domain.com");

            // Result
            expect(sgMail.setApiKey).toHaveBeenCalledTimes(1);
            expect(result).toMatchSnapshot();
        })
        test("Sends email confirmation through sgMail.send()", async () => {
            // Setup

            // Implementation
            const result = await Utils.sendResetPasswordConfirmation("name@domain.com");

            // Result
            expect(sgMail.send).toHaveBeenCalledTimes(1);
            expect(result).toMatchSnapshot();
        })
        test("Returns object if sgMail.send() failed", async () => {
            // Setup
            vi.mocked(sgMail.send).mockResolvedValueOnce([{
                statusCode: 500,
                body: Response,
                headers: {}
            }, {}])

            // Implementation
            const result = await Utils.sendResetPasswordConfirmation("name@domain.com");

            // Result
            expect(result).toEqual({
                ok: false,
                message: "Error at mail provider"
            })
            expect(result).toMatchSnapshot();
        })
        test("Returns object if sgMail.send() succeeds", async () => {
            // Setup

            // Implementation
            const result = await Utils.sendResetPasswordConfirmation("name@domain.com");

            // Result
            expect(result).toEqual({
                ok: true,
                message: "Code sent!"
            })
            expect(result).toMatchSnapshot();
        })
    })
    // The following tests are TDD
    describe.skip("generateKmsDataKey", () => {
        test("Returns Data Key", async () => {
            // Implementation
            const accessKeyId = process.env.VITE_KMS_KEY;
            const secretAccessKey = process.env.AWS_KMS_SECRET;
            const region = 'us-east-1';
            const service = 'kms';
            try {
                if (!accessKeyId || !secretAccessKey) throw new Error("Missing keys", { cause: 400 });
                const signer = new SignatureV4({
                    credentials: { accessKeyId, secretAccessKey },
                    service,
                    region,
                    sha256: Sha256
                });
                const signedRequest = await signer.sign({
                    method: "POST",
                    hostname: "kms.us-east-1.amazonaws.com",
                    protocol: "https:",
                    port: 443,
                    path: "/",
                    headers: {
                      'Content-Type': 'application/x-amz-json-1.1',
                      'X-Amz-Target': 'TrentService.GenerateDataKey',
                      'Host': "kms.us-east-1.amazonaws.com",
                    },
                    body: JSON.stringify({
                      "KeyId": "alias/scheduler",
                      "KeySpec": "AES_256"
                    })
                })
                const response = await fetch("https://kms.us-east-1.amazonaws.com", {
                    method: signedRequest.method,
                    headers: signedRequest.headers,
                    body: signedRequest.body
                });
                if (!response) throw new Error("No response", { cause: 500 })
                if (!response.ok) {
                    const errorText = await response.text(); // Get AWS error message
                    throw new Error(`Request failed: ${response.status} - ${errorText}`);
                }
                // Result
                const responseText = await response.text(); 
                const result = JSON.parse(responseText);
                console.log("Parsed Result:", result);
                if (result.CiphertextBlob && result.Plaintext) {
                    // Assertion
                    expect(signer).toBeInstanceOf(SignatureV4);
                    expect(result).toMatchObject({
                        CiphertextBlob: expect.any(String),
                        KeyId: expect.any(String),
                        KeyMaterialId: expect.any(String),
                        KeyOrigin: "AWS_KMS",
                        Plaintext: expect.any(String),
                      });
                    expect(result.KeyOrigin).toEqual("AWS_KMS");
                    expect(result).toMatchSnapshot();
                } else {
                    throw new Error("Invalid response", { cause: 400 });
                }
            } catch (e) {
                throw e;
            }
        })
    })
    describe.skip("decryptKmsDataKey", () => {
        test("Decrypts Data Key", async () => {
            const accessKeyId = process.env.VITE_KMS_KEY;
            const secretAccessKey = process.env.AWS_KMS_SECRET;
            const KeyId = process.env.VITE_KMS_ARN;
            const CiphertextBlob = "AQIDAHjI+EmDTWCmrJVuYc/6gcLE2ANzgDXBlU1vcqMnJqYhOAGDL+xvylB0UieO+ebbTVAhAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMEMn8asoOiipUbmPGAgEQgDuO9toq6qS4CVD9JKkuzNk9d9oL1fH7qWL/ssf7rnZlBzZ2wtsi9dN1dd7poGyM20rHxs8DInKoUJho7w=="
              
            try {
                if (!accessKeyId || !secretAccessKey || !KeyId) throw new Error("Missing keys", { cause: 400 })
                const client = new KMSClient({
                    region: "us-east-1",
                    credentials: {
                        accessKeyId,
                        secretAccessKey,
                    },
                });
                    
                const command = new DecryptCommand({
                    CiphertextBlob: Buffer.from(CiphertextBlob, "base64"), // Convert to Buffer
                    KeyId,
                });
                const result = await client.send(command);
                console.log(result);
                if (result.Plaintext) {
                    const key = Buffer.from(result.Plaintext).toString("base64");
                    expect(key).toBeTypeOf("string");
                    console.log(key)
                }
                expect(result.Plaintext).toBeInstanceOf(Uint8Array);
                expect(result.Plaintext).toMatchSnapshot();
            } catch (err) {
                console.error("KMS Error:", err);
                throw err;
            }
        }, 60000)
    })
})