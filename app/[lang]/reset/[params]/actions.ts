"use server"
import pool from "@/app/lib/mocks/db";
import { sql } from "@vercel/postgres";
import "server-only"

export async function verifyResetTokenAction (email: string, token: string) {
    const query = await sql`
        SELECT token, expires_at FROM scheduler_password_resets
        WHERE email = ${email} AND token = ${token} AND used_at IS NULL
        ORDER BY expires_at DESC LIMIT 1;
    `;
    return query;
}