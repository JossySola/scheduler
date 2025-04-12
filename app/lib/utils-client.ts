import {
  KmsKeyringBrowser,
  KMS,
  getClient,
  buildClient,
  CommitmentPolicy,
} from "@aws-crypto/client-browser";

export async function encryptKMS (data: string) {
    const generatorKeyId = process.env.AWS_KMS_GENERATOR_KEY;
    const keyIds = [`${process.env.AWS_KMS_ARN}`];
    const accessKeyId = process.env.AWS_KMS_KEY;
    const secretAccessKey = process.env.AWS_KMS_SECRET;
    if (!accessKeyId || !secretAccessKey || !process.env.AWS_KMS_ARN || !data || !generatorKeyId) return null;
    try {
        const { encrypt } = buildClient(
        CommitmentPolicy.REQUIRE_ENCRYPT_REQUIRE_DECRYPT
        );
        const clientProvider = getClient(KMS, {
        credentials: {
            accessKeyId,
            secretAccessKey,
        }
        });
        const keyring = new KmsKeyringBrowser({ clientProvider, generatorKeyId, keyIds });
        const context = {
        stage: 'development',
        purpose: 'strategic schedule maker',
        origin: 'us-east-1',
        }
        const encoder = new TextEncoder();
        const plainText = encoder.encode(data);
        const { result } = await encrypt(keyring, plainText, { encryptionContext: context });
        return result;
    } catch (e) {
        return null;
    }
}
export async function decryptKMS (data: Uint8Array) {
    const generatorKeyId = process.env.AWS_KMS_GENERATOR_KEY;
    const keyIds = [`${process.env.AWS_KMS_ARN}`];
    const accessKeyId = process.env.AWS_KMS_KEY;
    const secretAccessKey = process.env.AWS_KMS_SECRET;
    if (!accessKeyId || !secretAccessKey || !process.env.AWS_KMS_ARN || !data || !generatorKeyId) return null;
    try {
        const { decrypt } = buildClient(
        CommitmentPolicy.REQUIRE_ENCRYPT_REQUIRE_DECRYPT
        )
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
        stage: 'development',
        purpose: 'strategic schedule maker',
        origin: 'us-east-1',
        }
        const { plaintext, messageHeader } = await decrypt(keyring, data);
        const { encryptionContext } = messageHeader;
        Object.entries(context).forEach(([key, value]) => {
        if (encryptionContext[key] !== value)
            throw new Error('Encryption Context does not match expected values');
        })
        return plaintext;
    } catch (e) {
        return null;
    }
}
export function getDeviceInfo() {
    if (typeof window === 'undefined') return null; // SSR guard
  
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      pixelDepth: window.screen.pixelDepth,
      deviceMemory: (navigator as any).deviceMemory || 'Unknown',
      hardwareConcurrency: navigator.hardwareConcurrency || 'Unknown',
    };
  }