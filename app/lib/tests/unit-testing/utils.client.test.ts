import { buildClient, CommitmentPolicy, getClient, KMS, KmsKeyringBrowser } from "@aws-crypto/client-browser";
import { expect, describe, test } from "vitest";

describe("utils-client", () => {
    describe.skip("encryptKMS", () => {
        test("Encrypts data", async () => {
            // Setup
            const input = "This is a test";
            const generatorKeyId = process.env.AWS_KMS_GENERATOR_KEY;
            const keyIds = [`${process.env.AWS_KMS_ARN}`];
            const accessKeyId = process.env.AWS_KMS_KEY;
            const secretAccessKey = process.env.AWS_KMS_SECRET;

            try {
                if (!generatorKeyId || process.env.AWS_KMS_ARN === undefined || !accessKeyId || !secretAccessKey) {
                    throw new Error("Missing key", { cause: 400 });
                }
                const { encrypt } = buildClient(CommitmentPolicy.REQUIRE_ENCRYPT_REQUIRE_DECRYPT);
                const clientProvider = getClient(KMS, {
                    credentials: {
                        accessKeyId,
                        secretAccessKey,
                    }
                });
                const keyring = new KmsKeyringBrowser({ clientProvider, generatorKeyId, keyIds });
                const context = {
                    stage: 'testing',
                    purpose: 'encrypt-decrypt test',
                    origin: 'us-east-1',
                }
                const encoder = new TextEncoder();
                const plainText = encoder.encode(input);
                const { result } = await encrypt(keyring, plainText, { encryptionContext: context });
                
                // Assertion
                expect(keyring).toBeInstanceOf(KmsKeyringBrowser)
                expect(plainText).toBeInstanceOf(Uint8Array)
                expect(result).toBeInstanceOf(Uint8Array)
                expect(result).toMatchSnapshot();
            } catch (e) {
                throw e;
            }
        })
    })
    describe.skip("decryptKMS", () => {
        test("Decrypts data", async () => {
            const generatorKeyId = process.env.AWS_KMS_GENERATOR_KEY;
            const keyIds = [`${process.env.AWS_KMS_ARN}`];
            const accessKeyId = process.env.AWS_KMS_KEY;
            const secretAccessKey = process.env.AWS_KMS_SECRET;
            const data = ""
            try {
                if (!generatorKeyId || process.env.AWS_KMS_ARN === undefined || !accessKeyId || !secretAccessKey) {
                    throw new Error("Missing key", { cause: 400 });
                }
                const { decrypt } = buildClient(CommitmentPolicy.REQUIRE_ENCRYPT_REQUIRE_DECRYPT);
                const clientProvider = getClient(KMS, {
                    credentials: {
                        accessKeyId,
                        secretAccessKey,
                    }
                });
                const keyring = new KmsKeyringBrowser({
                    clientProvider,
                    generatorKeyId,
                    keyIds,
                });
                const context = {
                    stage: 'testing',
                    purpose: 'encrypt-decrypt test',
                    origin: 'us-east-1',
                }
                const { plaintext, messageHeader } = await decrypt(keyring, data);
                const { encryptionContext } = messageHeader;
                Object.entries(context).forEach(([key, value]) => {
                    if (encryptionContext[key] !== value) {
                        throw new Error('Encryption Context does not match expected values')
                    }
                })
            } catch (e) {
                throw e;
            }
        })
    })
})