import { sql } from "@vercel/postgres";

export async function isAccountLocked(email: string): Promise<{ status: boolean, nextAttempt?: string }> {
    try {
        const response = await sql`
        SELECT next_attempt_allowed_at
        FROM scheduler_login_attempts
        WHERE email = ${email}
        AND next_attempt_allowed_at > NOW();
        `;
        return {
            status: true,
            nextAttempt: response.rows[0].next_attempt_allowed_at,
        };
    } catch (error) {
        return { status: false };
    }
}