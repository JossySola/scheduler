import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from "vitest";
import { decrypt, decryptKmsDataKey, encrypt, generateKmsDataKey, isPasswordPwned, sendResetPasswordConfirmation, signedOnlyWithProvider, verifyPasswordAction } from "../../utils";
import { server } from "../mocks/node";
import { sql } from "@vercel/postgres";
import sgMail from "@sendgrid/mail";
import { http, HttpResponse } from "msw";
import * as argon from "argon2";

describe("Server Utils", () => {
    describe("isPasswordPwned", () => {
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
    describe("sendResetPasswordConfirmation", () => {
        beforeAll(() => {
            vi.mock("@vercel/postgres", () => ({
                sql: vi.fn().mockResolvedValue({
                    rows: [{
                        rowCount: 1,
                        email: "name@domain.com",
                    }]
                })
            }));
            vi.mock("@sendgrid/mail", () => ({
                default: {
                    setApiKey: vi.fn(),
                    send: vi.fn().mockResolvedValue([{
                        statusCode: 202
                    }]),
                }
            }));
        });
        afterEach(() => {
            vi.clearAllMocks();
            vi.restoreAllMocks();
        });
        test("returns successful message", async () => {
            const result = await sendResetPasswordConfirmation("name@domain.com");
            expect(result).toEqual({
                ok: true,
                message: 'Code sent!',
            });
            expect(result).toMatchSnapshot();
        });
        test("returns unsuccessful message when email is invalid", async () => {
            const result = await sendResetPasswordConfirmation("email");
            expect(result).toEqual({
                ok: false,
                message: "Invalid email"
            });
            expect(result).toMatchSnapshot();
        });
        test("returns unsuccessful message when email is empty", async () => {
            const result = await sendResetPasswordConfirmation("");
            expect(result).toEqual({
                ok: false,
                message: "Invalid email"
            });
            expect(result).toMatchSnapshot();
        });
        test("returns unsuccessful message when email is not found", async () => {
            vi.fn(sql).mockResolvedValueOnce({
                rowCount: 0,
                rows: [],
                command: "INSERT",
                oid: 0,
                fields: [],
            });
            const result = await sendResetPasswordConfirmation("name@domain.com");
            expect(result).toEqual({
                ok: false,
                message: "Email not found",
            });
            expect(result).toMatchSnapshot();
        });
        test("throws when insertion into database fails", async () => {
            vi.fn(sql).mockRejectedValueOnce(new Error("Mock Error"));
            const result = await sendResetPasswordConfirmation("name@domain.com");
            expect(result).toEqual({
                ok: false,
                message: "Password confirmation error: Error: Mock Error"
            });
            expect(result).toMatchSnapshot();
        });
        test("returns unsuccessful message when sgMail.send fails", async () => {
            (sgMail.send as any).mockResolvedValueOnce([{ statusCode: 500 }]);
            const result = await sendResetPasswordConfirmation("name@domain.com");
            expect(result).toEqual({
                ok: false,
                message: "Error at mail provider"
            })
        });
    });
    describe("generateKmsDataKey", () => {
        beforeAll(() => {
            vi.stubEnv("AWS_KMS_KEY", "KMS_KEY_MOCK");
            vi.stubEnv("AWS_KMS_SECRET", "KMS_SECRET_MOCK");
            server.listen();
        });
        afterEach(() => server.resetHandlers());
        afterAll(() => server.close());
        
        test("returns CiphertextBlob and Plaintext", async () => {
            server.use(
                http.post("https://kms.us-east-1.amazonaws.com", async ({ request }) => {
                    const headers = request.headers;
                    expect(headers.get("Content-Type")).toBe("application/x-amz-json-1.1");
                    expect(headers.get("X-Amz-Target")).toBe("TrentService.GenerateDataKey");
                    expect(headers.get("Host")).toBe("kms.us-east-1.amazonaws.com");
                    const body = await request.json();
                    expect(body).toMatchObject({
                        "KeyId": "alias/scheduler",
                        "KeySpec": "AES_256"
                    });
                    return HttpResponse.json({
                        CiphertextBlob: "cipher_mock",
                        Plaintext: "plaintext_mock",
                    });
                })
            );
            const result = await generateKmsDataKey();
            expect(result).toEqual({
                CiphertextBlob: "cipher_mock",
                Plaintext: "plaintext_mock"
            });
            expect(result).toMatchSnapshot();
        });
        test("throws when reaching AWS KMS endpoint fails", async () => {
            server.use(
                http.post("https://kms.us-east-1.amazonaws.com", async () => {
                    return HttpResponse.error();
                })
            );
            await expect(generateKmsDataKey()).rejects.toThrow();
        });
        test("returns 'Invalid response' if CiphertextBlob and Plaintext are empty", async () => {
            server.use(
                http.post("https://kms.us-east-1.amazonaws.com", async () => {
                    return HttpResponse.json({
                        CiphertextBlob: "",
                        Plaintext: ""
                    });
                })
            );
            await expect(generateKmsDataKey()).rejects.toThrowError("Invalid response");
        });
    });
    describe("decryptKmsDataKey", () => {
        beforeAll(() => {
            vi.stubEnv("AWS_KMS_KEY", "KMS_KEY_MOCK");
            vi.stubEnv("AWS_KMS_SECRET", "KMS_SECRET_MOCK");
            vi.stubEnv("AWS_KMS_ARN", "KMS_ARN_MOCK");
            vi.mock("@aws-sdk/client-kms", () => ({
                KMSClient: vi.fn(class {
                    region: string;
                    credentials: { accessKeyId: string, secretAccessKey: string }
                    constructor({ region, credentials }: { region: string, credentials: { accessKeyId: string, secretAccessKey: string }}) {
                        this.region = region;
                        this.credentials = credentials;
                    }
                    send = vi.fn((command) => {
                        return {
                            Plaintext: "plaintext_mock"
                        }
                    })
                }),
                DecryptCommand: vi.fn(class {
                    CiphertextBlob: string;
                    KeyId: string;
                    constructor({ CiphertextBlob, KeyId }: { CiphertextBlob: string, KeyId: string }) {
                        this.CiphertextBlob = CiphertextBlob;
                        this.KeyId = KeyId;
                    }
                })
            }));
        });
        test("decrypts CiphertextBlob and returns Plaintext", async () => {
            const result = await decryptKmsDataKey("ciphertextblob_mock");
            expect(result).toBe("cGxhaW50ZXh0X21vY2s=");
            expect(result).toMatchSnapshot();
        });
        test("throws error if Cipher input is empty", async () => {
            await expect(decryptKmsDataKey("")).rejects.toThrowError("Cipher is malformed or empty");
        });
    });
    describe("encrypt", () => {
        test("encrypts a simple string", async () => {
            const key = Buffer.alloc(32).toString("base64");
            const result = await encrypt("Hello", key);
            expect(typeof result).toBe("string");
            const parts = result.split(":");
            expect(parts.length).toBe(3);
        });
        test("returns iv and ciphertext separated by colon", async () => {
            const key = Buffer.alloc(32).toString("base64");
            const result = await encrypt("test", key);
            const [iv, ciphertext, tag] = result.split(":");
            expect(iv).toBeDefined();
            expect(ciphertext).toBeDefined();
            expect(tag).toBeDefined();
        });
        test("produces different outputs for same inputs due to random IV", async () => {
            const key = Buffer.alloc(32).toString("base64");
            const a = await encrypt("hello", key);
            const b = await encrypt("hello", key);
            expect(a).not.toBe(b);
        });
        test("encrypt returns iv:ciphertext:tag format", async () => {
            const key = Buffer.alloc(32).toString("base64");
            const result = await encrypt("Hello", key);
            const parts = result.split(":");
            expect(parts).toHaveLength(3);
            const [iv, ciphertext, tag] = parts;
            expect(iv.length).toBeGreaterThan(0);
            expect(ciphertext.length).toBeGreaterThan(0);
            expect(tag.length).toBeGreaterThan(0);
        });
        test("encrypts empty string", async () => {
            const key = Buffer.alloc(32).toString("base64");
            const result = await encrypt("", key);
            expect(result).toContain(":");
        });
        test("throws if key length is invalid", async () => {
            const badKey = Buffer.alloc(10).toString("base64");
            await expect(encrypt("hello", badKey)).rejects.toThrow();
        });
        test("throws if key is not base64", async () => {
            await expect(encrypt("hello", "not-base64")).rejects.toThrow();
        });
    });
    describe("decrypt", () => {
        test("decrypts data encrypted by encrypt()", async () => {
            const key = Buffer.alloc(32).toString("base64");
            const encrypted = await encrypt("Hello world", key);
            const decrypted = await decrypt(encrypted, key);
            expect(decrypted).toBe("Hello world");
            expect(decrypted).toMatchSnapshot();
        });
        test("decrypts unicode text correctly", async () => {
            const key = Buffer.alloc(32).toString("base64");
            const encrypted = await encrypt("こんにちは🌙", key);
            const decrypted = await decrypt(encrypted, key);
            expect(decrypted).toBe("こんにちは🌙");
        });
        test("decrypts empty string", async () => {
            const key = Buffer.alloc(32).toString("base64");
            const encrypted = await encrypt("", key);
            const decrypted = await decrypt(encrypted, key);
            expect(decrypted).toBe("");
        });
        test("decrypts data encrypted by encrypt()", async () => {
            const key = Buffer.alloc(32).toString("base64");
            const plaintext = "Hello world";
            const encrypted = await encrypt(plaintext, key);
            const decrypted = await decrypt(encrypted, key);
            expect(decrypted).toBe(plaintext);
        });
        test("throws if wrong key is used", async () => {
            const key1 = Buffer.alloc(32, 1).toString("base64");
            const key2 = Buffer.alloc(32, 2).toString("base64");
            const encrypted = await encrypt("secret", key1);
            await expect(decrypt(encrypted, key2)).rejects.toThrow();
        });
        test("throws if key is incorrect", async () => {
            const key1 = Buffer.alloc(32).toString("base64");
            const key2 = Buffer.alloc(32, 1).toString("base64");
            const encrypted = await encrypt("secret", key1);
            await expect(decrypt(encrypted, key2)).rejects.toThrow();
        });
        test("throws if ciphertext is modified", async () => {
            const key = Buffer.alloc(32).toString("base64");
            const encrypted = await encrypt("secret", key);
            const [iv, ciphertext, tag] = encrypted.split(":");
            // corrupt ciphertext
            const corrupted = ciphertext.slice(0, -2) + "AA";
            const tampered = [iv, corrupted, tag].join(":");
            await expect(decrypt(tampered, key)).rejects.toThrow();
        });
        test("throws if encrypted string format is invalid", async () => {
            const key = Buffer.alloc(32).toString("base64");
            await expect(
                decrypt("invalid-format", key)
            ).rejects.toThrow();
        });
        test("throws if encrypted data is invalid base64", async () => {
            const key = Buffer.alloc(32).toString("base64");
            const bad = "invalid:%%%";
            await expect(decrypt(bad, key)).rejects.toThrow();
        });
        test("throws if IV length is invalid", async () => {
            const key = Buffer.alloc(32).toString("base64");
            const badIv = Buffer.alloc(8).toString("base64");
            const bad = `${badIv}:abcd`;
            await expect(decrypt(bad, key)).rejects.toThrow();
        });
    });
    describe("verifyPasswordAction", () => {
        test("verifies password with Argon2 and returns true", async () => {
            const password = "Password123";
            const hashed = await argon.hash(password);
            const result = await verifyPasswordAction(hashed, password);
            expect(result).toBe(true);
            expect(result).toMatchSnapshot();
        });
        test("returns false if verification fails", async () => {
            const password = "Password123";
            const hashed = await argon.hash(password);
            const result = await verifyPasswordAction(hashed, "IncorrectPassword");
            expect(result).toBe(false);
            expect(result).toMatchSnapshot();
        });
    });
    describe("hashPasswordAction", () => {
        test("correctly hashes password", async () => {
            const password = "Password123";
            const hashed = await argon.hash(password);
            const result = await verifyPasswordAction(hashed, password);
            expect(typeof hashed).toBe("string");
            expect(result).toBe(true);
            expect(result).toMatchSnapshot();
        });
    });
    describe("signedOnlyWithProvider", () => {
        beforeAll(() => {
            vi.mock("@vercel/postgres", () => ({
                sql: vi.fn().mockImplementation(() => ({
                    rows: [{
                        password: null,
                        user_password_key: null,
                    }]
                }))
            }));
        });
        test("returns true if password & user_password_key are 'null'", async () => {
            const result = await signedOnlyWithProvider("id_mock");
            expect(result).toBe(true);
            expect(result).toMatchSnapshot();
        });
        test("returns false if either password or user_password_key are not null", async () => {
            (sql as any).mockImplementation(() => ({
                rows: [{
                    password: "password_mock",
                    user_password_key: "key_mock"
                }]
            }));
            const result = await signedOnlyWithProvider("id_mock");
            expect(result).toBe(false);
            expect(result).toMatchSnapshot();
        });
    });
});