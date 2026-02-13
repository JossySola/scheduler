import { sql } from "@vercel/postgres";

export async function getPasswordKey(email: string): Promise<string | null> {
    try {
        const response = await sql`
        SELECT user_password_key FROM scheduler_users
        WHERE email = ${email} OR username = ${email};
        `;
        return response.rows[0].user_password_key;
    } catch (error) {
        return null;
    }
}