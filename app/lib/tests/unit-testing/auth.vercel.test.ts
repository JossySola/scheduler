import { describe, expect, test, vi } from "vitest";
import { getDecryptedKey } from "../../auth/getDecryptedKey";
import { KMSClient } from "@aws-sdk/client-kms";

vi.mock('@aws-sdk/client-kms', () => {
    return {
        KMSClient: vi.fn(class {
            Plaintext = Buffer.from("decryptedKey");
            send = vi.fn().mockResolvedValue({ Plaintext: this.Plaintext });
        }),
        DecryptCommand: vi.fn().mockReturnValue(class {
            
        }),
    }
});
vi.stubEnv("AWS_KMS_KEY", "testAccessKey");
vi.stubEnv("AWS_KMS_SECRET", "testSecretKey");
vi.stubEnv("AWS_KMS_ARN", "testKeyArn");

describe("Next Auth", () => {
    describe("getDecryptedKey", () => {
        test("KMSClient constructor has been called", async () => {
            const response = await getDecryptedKey("dGVzdENpcGhlclRleHQ="); // "testCipherText" in base64
            //expect(response).toBe("ZGVjcnlwdGVkS2V5"); // "decryptedKey" in base64
            expect(KMSClient).toHaveBeenCalled();
        });
    });
});