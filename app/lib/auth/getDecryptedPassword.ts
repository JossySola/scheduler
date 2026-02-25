import { sql } from "@vercel/postgres";
import { z } from "zod/v4";

export async function getDecryptedPassword(decryptedKey: string, email: string): Promise<string | null> {
    try {
        const verifiedKey = z.guid().safeParse(decryptedKey);
        if (!verifiedKey.success) {
            console.error("Invalid decrypted key format:", verifiedKey.error);
            throw new Error("Invalid decrypted key");
        }
        const verifiedEmail = z.email().safeParse(email);
        if (!verifiedEmail.success) {
            console.error("Invalid email format:", verifiedEmail.error);
            throw new Error("Invalid email format");
        }
        const password = await sql`
        SELECT pgp_sym_decrypt_bytea(password, ${decryptedKey}) AS decrypted_password
        FROM scheduler_users
        WHERE email = ${email} OR username = ${email};
        `;
        return password.rows[0].decrypted_password;
    } catch (error) {
        console.error("Error decrypting the password:", error);
        return null;
    }
}