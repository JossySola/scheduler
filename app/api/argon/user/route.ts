"use server"
import "server-only";
import { getUserFromDb } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/mocks/db";

export async function POST (request: NextRequest): Promise<NextResponse> {
    const { username, password } = await request.json();
    
    if (!username || !password) {
        return NextResponse.json({ error: 'Missing username or password./' }, { status: 409 })
    }

    const locked = await pool.query(`
       SELECT next_attempt_allowed_at FROM scheduler_login_attempts WHERE email = $1;
    `, [username]);

    if (typeof locked.rowCount === 'number' && locked.rowCount > 0) {
        const { next_attempt_allowed_at } = locked.rows[0];

        if (next_attempt_allowed_at && new Date(next_attempt_allowed_at) > new Date()) {
            return NextResponse.json({
                error: "Wait for the timer to finish for another attempt./",
                next_attempt: new Date(next_attempt_allowed_at).toISOString()
            }, { status: 401 });
        }
    }

    const user = await getUserFromDb(username, password);

    if (!user.ok) {
        if (user.provider) {
            return NextResponse.json({
                error: `${user.message}/`
            }, { status: 400 });
        }

        const fail = await pool.query(`
           INSERT INTO scheduler_login_attempts (email, attempts, last_attempt_at, next_attempt_allowed_at)
           VALUES ($1, 1, NOW(), NOW() + INTERVAL '1 minute')
           ON CONFLICT (email) DO UPDATE
           SET attempts = scheduler_login_attempts.attempts + 1,
                last_attempt_at = NOW(),
                next_attempt_allowed_at = NOW() + (scheduler_login_attempts.attempts || ' minutes')::INTERVAL
            RETURNING next_attempt_allowed_at;
        `, [username]);

        return NextResponse.json({
            error: user.message,
            next_attempt: fail.rows[0].next_attempt_allowed_at
        }, { status: 401 });
    }

    await pool.query(`
       DELETE FROM scheduler_login_attempts WHERE email = $1; 
    `, [username]);

    return NextResponse.json({
        user
    }, { status: 200 });
}