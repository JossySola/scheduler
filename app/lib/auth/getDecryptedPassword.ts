import { sql } from "@vercel/postgres";

export async function getDecryptedPassword(decryptedKey: string, email: string): Promise<string | null> {
    try {
        const password = await sql`
        SELECT pgp_sym_decrypt_bytea(password, ${decryptedKey}) AS decrypted_password
        FROM scheduler_users
        WHERE email = ${email} OR username = ${email};
        `;
        return password.rows[0]?.decrypted_password.toString();
    } catch (error) {
        console.error("Error decrypting the password:", error);
        return null;
    }
}