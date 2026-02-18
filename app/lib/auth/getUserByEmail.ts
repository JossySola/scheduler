import { sql } from "@vercel/postgres";
import { z } from "zod/v4";

export async function getUserByEmail(email: string): Promise<string | null> {
    try {
        const verifyEmail = z.email().safeParse(email);
        if (!verifyEmail.success) {
            throw new Error("Invalid email format");
        }
        const id = await sql`
        SELECT id FROM scheduler_users WHERE email = ${email};`
        return id.rows[0]?.id;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        return null;
    }
}