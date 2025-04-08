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

    const queryKey = await pool.query(`
        SELECT user_password_key FROM scheduler_users
        WHERE email = $1 OR username = $1;
    `, [username]);

    if (!queryKey.rows.length || queryKey.rowCount === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    const key = queryKey.rows[0].user_password_key;

    const queryUser = await pool.query(`
        SELECT pgp_sym_decrypt_bytea(password, $2) AS decrypted_password
        FROM scheduler_users
        WHERE email = $1 OR username = $1;
    `, [username, key]);
    if (!queryUser.rows.length || queryUser.rowCount === 0) {
        return NextResponse.json({ error: "Invalid key" }, { status: 500 });
    }
    const hashed = queryUser.rows[0].decrypted_password;
    
    const argon = new Argon2id();
    const verify = await argon.verify(hashed, password);

    if (!verify) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 403 })
    }

    return NextResponse.json({ statusText: 'Granted' }, { status: 200 });
}