import pool from "@/app/lib/mocks/db";
import { NextRequest, NextResponse } from "next/server";
import { Argon2id } from "oslo/password";

export async function POST (request: NextRequest) {
    const payload = await request.json();

    if (!payload || !payload.password || !payload.username) {
        return NextResponse.json({
            status: 400,
            statusText: 'Empty payload'
        })
    }

    const original = await pool.query(`
        SELECT password FROM scheduler_users
            WHERE email = $1 OR username = $1;
    `, [payload.username]);

    if (!original || original.rowCount === 0) {
        return NextResponse.json({
            status: 401,
            statusText: 'User not found'
        })
    }
    const hashed = original.rows[0].password;
    const argon = new Argon2id();
    const verify = await argon.verify(hashed, payload.password);

    if (!verify) {
        return NextResponse.json({
            status: 403,
            statusText: 'Invalid credentials'
        })
    }

    return NextResponse.json({
        status: 200,
        statusText: 'Granted'
    });
}