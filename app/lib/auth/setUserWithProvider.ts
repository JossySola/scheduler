import { sql } from "@vercel/postgres";
import { generateKmsDataKey } from "../utils";

export async function setUserWithProvider(email: string, provider: string, providerId: string): Promise<{ success: boolean }> {
    try {
        const key = await generateKmsDataKey();
        await sql`
        INSERT INTO scheduler_users_providers(email, provider, account_id, account_id_key)
        VALUES(
            ${email},
            ${provider},
            pgp_sym_encrypt(${providerId}, ${key?.Plaintext}),
            ${key?.CiphertextBlob}
        );
        `;
        return { success: true };
    } catch (error) {
        console.error("Error setting user with provider:", error);
        return { success: false };
    }
}