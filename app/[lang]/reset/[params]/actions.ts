"use server"
import pool from "@/app/lib/mocks/db";
import "server-only"

export async function verifyResetTokenAction (email: string, token: string) {
    const query = await pool.query(`
        SELECT token, expires_at FROM scheduler_password_resets
        WHERE email = $1 AND token = $2 AND used_at IS NULL
        ORDER BY expires_at DESC LIMIT 1;
    `, [email, token]);
    return query;
}