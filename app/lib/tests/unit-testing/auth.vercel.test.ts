import { afterEach, describe, expect, test, vi } from "vitest";
import { getDecryptedKey } from "../../auth/getDecryptedKey";
import { KMSClient } from "@aws-sdk/client-kms";
import { getDecryptedPassword } from "../../auth/getDecryptedPassword";
import { sql } from "@vercel/postgres";
import { getPasswordKey } from "../../auth/getPasswordKey";

vi.mock('@aws-sdk/client-kms', () => {
    return {
        KMSClient: vi.fn(class {
            Plaintext = Buffer.from("decryptedKey");
            send = vi.fn().mockResolvedValue({ Plaintext: this.Plaintext });
        }),
        DecryptCommand: vi.fn(class {

        }),
    }
});
vi.mock('@vercel/postgres', () => {
    return {
        sql: vi.fn().mockResolvedValue({
            rows: [{ 
                decrypted_password: Buffer.from("decryptedPassword"),
                user_password_key: "decryptedPassword",
            }]
        }),
    }
})
vi.stubEnv("AWS_KMS_KEY", "testAccessKey");
vi.stubEnv("AWS_KMS_SECRET", "testSecretKey");
vi.stubEnv("AWS_KMS_ARN", "testKeyArn");

describe("Next Auth", () => {
    afterEach(() => vi.restoreAllMocks());
    describe("getDecryptedKey", () => {
        afterEach(() => vi.restoreAllMocks());
        test("KMSClient constructor has been called", async () => {
            const result = await getDecryptedKey("dGVzdENpcGhlclRleHQ="); // "testCipherText" in base64
            expect(KMSClient).toHaveBeenCalled();
            expect(result).toMatchSnapshot();
        });
        test("DecryptCommand constructor has been called with correct parameters", async () => {
            const DecryptCommand = (await import('@aws-sdk/client-kms')).DecryptCommand;
            const result = await getDecryptedKey("dGVzdENpcGhlclRleHQ=");
            expect(DecryptCommand).toHaveBeenCalledWith({
                CiphertextBlob: Buffer.from("dGVzdENpcGhlclRleHQ=", "base64"),
                KeyId: "testKeyArn",
            });
            expect(DecryptCommand).toMatchSnapshot();
            expect(result).toMatchSnapshot();
        });
        test("returns decrypted key in base64 format", async () => {
            const result = await getDecryptedKey("dGVzdENpcGhlclRleHQ="); // "testCipherText" in base64
            expect(result).toBe("ZGVjcnlwdGVkS2V5"); // "decryptedKey" in base64
            expect(result).toMatchSnapshot();
        });
        test("returns null if decryption fails", async () => {
            const KMSClient = (await import('@aws-sdk/client-kms')).KMSClient;
            vi.fn(KMSClient.prototype.send).mockRejectedValue(new Error("Decryption failed"));
            const result = await getDecryptedKey("dGVzdENpcGhlclRleHQ="); // "testCipherText" in base64
            expect(result).toBeNull();
            expect(result).toMatchSnapshot();
        });
    });
    describe("getDecryptedPassword", () => {
        afterEach(() => vi.restoreAllMocks());
        test("sql utility has been called", async () => {
            const result = await getDecryptedPassword("decryptedKey", "email@domain.com");
            expect(sql).toHaveBeenCalled();
            expect(result).toMatchSnapshot();
        });
        test("return decrypted password as string", async () => {
            const result = await getDecryptedPassword("decryptedKey", "email@domain.com");
            expect(result).toBe("decryptedPassword");
            expect(result).toMatchSnapshot();
        });
        test("returns null if decryption fails", async () => {
            vi.fn(sql).mockRejectedValue(new Error("Decryption failed"));
            const result = await getDecryptedPassword("decryptedKey", "email@domain.com");
            expect(result).toBeNull();
            expect(result).toMatchSnapshot();
        });
    });
    describe("getPasswordKey", () => {
        afterEach(() => vi.restoreAllMocks());
        test("sql utility has been called", async () => {
            const result = await getPasswordKey("email@domain.com");
            expect(sql).toHaveBeenCalled();
            expect(result).toMatchSnapshot();
        });
        test("returns password key as string", async () => {
            const result = await getPasswordKey("email@domain.com");
            expect(result).toBe("decryptedPassword");
            expect(result).toMatchSnapshot();
        });
        test("returns null if retrieval fails", async () => {
            vi.fn(sql).mockRejectedValue(new Error("Retrieval failed"));
            const result = await getPasswordKey("email@domain.com");
            expect(result).toBeNull();
            expect(result).toMatchSnapshot();
        });
    });
});