import { sql } from "@vercel/postgres";
import { z } from "zod/v4";

export async function isAccountLocked(email: string): Promise<{ isLocked: boolean, nextAttempt?: string }> {
    try {
        const verifyEmail = z.email().safeParse(email);
        if (!verifyEmail.success) {
            throw new Error("Invalid email format");
        }
        const response = await sql`
        SELECT next_attempt_allowed_at
        FROM scheduler_login_attempts
        WHERE email = ${email}
        AND next_attempt_allowed_at > NOW();
        `;
        return {
            isLocked: true,
            nextAttempt: response.rows[0].next_attempt_allowed_at,
        };
    } catch (error) {
        console.error("Error checking account lock status:", error);
        return { isLocked: false };
    }
}