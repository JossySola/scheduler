import "server-only";
import { NextRequest, NextResponse } from "next/server";
import * as argon2 from "argon2";
import pool from "@/app/lib/mocks/db";

export async function POST (
    request: NextRequest
) {
    const incoming = await request.json();
    
    const name = incoming.name;
    const username = incoming.username;
    const birthday = incoming.birthday;
    const email = incoming.email;
    const password = await argon2.hash(incoming.password);

    try {
        await pool.query(`
            INSERT INTO scheduler_users (name, username, email, birthday, password)
                VALUES (
                    '${name}',
                    '${username}',
                    '${email}',
                    '${birthday}',
                    '${password}'
                )
        `)
        return NextResponse.json({
            status: 200,
            statusText: 'Signed up successfully!'
        })
    } catch (error) {
        let message = '';
        if (error.detail && error.detail.includes('already exists')) {
            if (error.detail.includes('username')) {
                message = 'Username already exists.'
            } else if (error.detail.includes('email')) {
                message = 'E-mail already used.'
            }
        } else {
            message = 'An unexpected error has occured.'
        }
        
        return NextResponse.json({
            status: 500,
            statusText: message,
        })
    }
}