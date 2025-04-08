"use server"
import "server-only";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/mocks/db";
import { Argon2id } from "oslo/password";
import { isPostgreSQLError } from "@/app/lib/definitions";
import { generateKmsDataKey } from "@/app/lib/utils";


export async function POST ( request: NextRequest ) {
    const incoming = await request.json();
    
    const name: string = incoming.name.toString();
    const username: string = incoming.username.toString();
    const birthday: string = incoming.birthday.toString();
    const email: string = incoming.email.toString();
    const password: string = incoming.password.toString();
    const argon2id = new Argon2id();
    const hash = await argon2id.hash(password);
    const dataKey = await generateKmsDataKey();

    if (!dataKey || !dataKey.CiphertextBlob || !dataKey.Plaintext) return NextResponse.json({ statusText: "Internal Error" }, { status: 500 })
    
    try {
        const isBlocked = await pool.query(`
            SELECT email FROM scheduler_blocked_emails
            WHERE email = $1;
        `, [email]);
        if (isBlocked.rows.length) {
            return NextResponse.json({ statusText: "Blocked" }, { status: 403 })
        }
        const registerUser = await pool.query(`
            INSERT INTO scheduler_users (name, username, email, birthday, password, user_password_key)
            VALUES ($1, $2, $3, $4::DATE, pgp_sym_encrypt($5, $6), $7);
        `, [name, username, email, birthday, hash, dataKey.Plaintext, dataKey.CiphertextBlob]);
        if (registerUser.rowCount === 0) {
            return NextResponse.json({ statusText: "Internal Error" }, { status: 500 });
        }
        return NextResponse.json({ statusText: "Success!" }, { status: 200 });
    } catch (error: unknown) {
        if (isPostgreSQLError(error)) {
            let message = '';
            if (error.detail && error.detail.includes('already exists')) {
                if (error.detail.includes('username')) {
                    message = 'Username already exists.'
                } else if (error.detail.includes('email')) {
                    message = 'E-mail already used.'
                }
            } else {
                message = 'An unexpected error has occured from route.'
            }
            return NextResponse.json({ error: message }, { status: 500 });
        }
        return NextResponse.json({ error }, { status: 500 });
    }
}