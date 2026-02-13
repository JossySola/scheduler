import { sql } from "@vercel/postgres";

export async function getUserByEmail(email: string): Promise<string | null> {
    try {
        const id = await sql`
        SELECT id FROM scheduler_users WHERE email = ${email};`
        return id.rows[0]?.id;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        return null;
    }
}