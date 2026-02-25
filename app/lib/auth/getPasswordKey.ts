import { sql } from "@vercel/postgres";
import { z } from "zod/v4";

export async function getPasswordKey(email: string): Promise<string | null> {
    try {
        const verifyEmail = z.email().safeParse(email);
        if (!verifyEmail.success) {
            throw new Error("Invalid email format");
        }
        const response = await sql`
        SELECT user_password_key FROM scheduler_users
        WHERE email = ${email} OR username = ${email};
        `;
        return response.rows[0].user_password_key;
    } catch (error) {
        console.error("Error retrieving the password key:", error);
        return null;
    }
}