import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from "vitest";
import { generateKmsDataKey, isPasswordPwned, sendResetPasswordConfirmation } from "../../utils";
import { server } from "../mocks/node";
import { sql } from "@vercel/postgres";
import sgMail from "@sendgrid/mail";
import { HttpMessage } from "@aws-sdk/types";
import { Sha256 } from "@aws-crypto/sha256-js";
import { SignatureV4 } from "@aws-sdk/signature-v4";

vi.mock("@aws-sdk/signature-v4", () => ({
    SignatureV4: vi.fn(class SignatureV4 { 
        credentials: { accessKeyId: string, secretAccessKey: string}; 
        service: string; 
        region: string; 
        sha256: Sha256; 
        constructor({ credentials, service, region, sha256 }:{ 
            credentials: { accessKeyId: string, secretAccessKey: string}, 
            service: string, 
            region: string, 
            sha256: Sha256 
        }) { 
            this.credentials = credentials; 
            this.service = service; 
            this.region = region; 
            this.sha256 = sha256; 
        }; 
        sign = vi.fn().mockResolvedValue(async function ({method, hostname, protocol, port, path, headers, body}:{ 
            method: string, 
            hostname: string, 
            protocol: string, 
            port: number, 
            path: string, 
            headers: { 'Content-Type': string, 'X-Amz-Target': string, 'Host': string } 
            body: HttpMessage 
        }) { 
            return { method: "POST", headers: {}, body: "" } 
        }); 
    }),
}));

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
    describe("sendResetPasswordConfirmation", async () => {
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
            const result = await generateKmsDataKey();
            expect(result).toEqual({
                CiphertextBlob: "cipher_mock",
                Plaintext: "plaintext_mock"
            });
            expect(result).toMatchSnapshot();
        });
        test("creates an instance of SignatureV4", async () => {
            await generateKmsDataKey();
            expect(SignatureV4).toHaveBeenCalled();
        });
    });
});