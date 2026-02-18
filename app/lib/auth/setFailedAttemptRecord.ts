import { sql } from "@vercel/postgres";
import { z } from "zod/v4";

export async function setFailedAttemptRecord(email: string): Promise<string | null> {
    try {
        const verifyEmail = z.email().safeParse(email);
        if (!verifyEmail.success) {
            throw new Error("Invalid email format");
        }
        const response = await sql`
        INSERT INTO scheduler_login_attempts (email, created_at, last_attempt_at, next_attempt_allowed_at, attempts)
        VALUES (${email}, NOW(), NOW(), NOW() + INTERVAL '1 minute', 1)
        ON CONFLICT (email) 
        DO UPDATE SET 
            last_attempt_at = NOW(),
            next_attempt_allowed_at = NOW() + (scheduler_login_attempts.attempts * INTERVAL '1 minute'),
            attempts = scheduler_login_attempts.attempts + 1
        RETURNING next_attempt_allowed_at;
        `;
        return response.rows[0].next_attempt_allowed_at;
    } catch (error) {
        console.error("Error setting failed attempt record:", error);
        return null;
    }
}