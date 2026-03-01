import { sql } from "@vercel/postgres";
import { generateKmsDataKey } from "../utils";
import { z } from "zod/v4";

export async function setUserWithProvider(email: string, provider: string, providerId: string): Promise<{ success: boolean }> {
    try {
        const verifyEmail = z.email().safeParse(email);
        if (!verifyEmail.success) {
            throw new Error("Invalid email format");
        }
        const verifyProvider = z.literal("facebook").or(z.literal("google")).safeParse(provider);
        if (!verifyProvider.success) {
            throw new Error("Invalid provider");
        }
        const verifyProviderId = z.string().nonempty().safeParse(providerId);
        if (!verifyProviderId.success) {
            throw new Error("Invalid provider ID format");
        }
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