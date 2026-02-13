import { DecryptCommand, KMSClient } from "@aws-sdk/client-kms";

export async function getDecryptedKey(passwordKey: string): Promise<string | null> {
    try {
        const accessKeyId: string = process.env.AWS_KMS_KEY!;
        const secretAccessKey: string = process.env.AWS_KMS_SECRET!;
        const KeyId: string = process.env.AWS_KMS_ARN!;

        const client = new KMSClient({
            region: "us-east-1",
            credentials: {
                accessKeyId,
                secretAccessKey
            },
        });
        const command = new DecryptCommand({
            CiphertextBlob: Buffer.from(passwordKey, "base64"),
            KeyId,
        });
        const response = await client.send(command);
        if (response) {
            const result = Buffer.from(response.Plaintext ?? "").toString("base64")
            return result;
        } else {
            console.error("Command response:", command);
            console.error("Client response:", response);
            throw new Error("Failed to decrypt the password key");
        }
    } catch (error) {
        console.error("Error decrypting the password key:", error);
        return null;
    }
}