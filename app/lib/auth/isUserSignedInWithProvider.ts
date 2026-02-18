import { sql } from "@vercel/postgres";
import { z } from "zod/v4";

export async function isUserSignedInWithProvider(email: string): Promise<boolean> {
    try {
        const verifyEmail = z.email().safeParse(email);
        if (!verifyEmail.success) {
            throw new Error("Invalid email format");
        }
        const response = await sql`
            SELECT provider FROM scheduler_users_providers
            WHERE email = ${email};
        `;
        return response.rowCount !== 0;
    } catch (error) {
        return false;
    }
}