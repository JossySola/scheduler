"use server"
import "server-only";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/mocks/db";
import { Argon2id } from "oslo/password";
import { isPostgreSQLError } from "@/app/lib/definitions";

export async function POST ( request: NextRequest ) {
    const incoming = await request.json();
    
    const name: string = incoming.name.toString();
    const username: string = incoming.username.toString();
    const birthday: string = incoming.birthday.toString();
    const email: string = incoming.email.toString();
    const password: string = incoming.password.toString();
    const secret: string | undefined = process.env.NEXTAUTH_SECRET;
    const argon2id = new Argon2id();
    const hash = await argon2id.hash(password);
    
    try {
        if (secret) {
            const registerUser = await pool.query(`
                INSERT INTO scheduler_users (name, username, email, birthday, password)
                VALUES ($1, $2, $3, $4::DATE, pgp_sym_encrypt($5, $6));
            `, [name, username, email, birthday, hash, secret]);
            
            if (registerUser.rowCount === 0) {
                return NextResponse.json({ statusText: "Internal Error" }, { status: 500 });
            }
            return NextResponse.json({ statusText: "Success!" }, { status: 200 });
        }
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