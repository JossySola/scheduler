"use server"
import "server-only";
import pool from "@/app/lib/mocks/db";
import { NextRequest, NextResponse } from "next/server";
import { Argon2id } from "oslo/password";

export async function POST (request: NextRequest): Promise<NextResponse> {
    const payload = await request.json();
    const password: string = payload.password;
    const username: string = payload.username;

    if (!payload || !password || !username) {
        return NextResponse.json({ error: 'Empty payload' }, { status: 400 });
    }

    const original = await pool.query(`
        SELECT password FROM scheduler_users
            WHERE email = $1 OR username = $1;
    `, [username]);

    if (!original || original.rowCount === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }
    const hashed = original.rows[0].password;
    const argon = new Argon2id();
    const verify = await argon.verify(hashed, password);

    if (!verify) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 403 })
    }

    return NextResponse.json({ statusText: 'Granted' }, { status: 200 });
}