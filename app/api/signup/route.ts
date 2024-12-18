import "server-only";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/mocks/db";
import { Argon2id } from "oslo/password";

export async function POST (
    request: NextRequest,
) {
    const incoming = await request.json();
    
    const name = incoming.name;
    const username = incoming.username;
    const birthday = incoming.birthday;
    const email = incoming.email;

    const argon2id = new Argon2id()
    const password = await argon2id.hash(incoming.password);
    console.log(typeof birthday)
    try {
        const result = await pool.query(`
            INSERT INTO scheduler_users (name, username, email, birthday, password)
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5
                );
        `, [name, username, email, birthday, password]);

        if (result.rowCount && result.rowCount > 0) {
            return NextResponse.json({
                status: 200,
                statusText: 'Signed up successfully!'
            })
        } else {
            throw new Error('Query failed');
        }
    } catch (error) {
        let message = '';
        console.error(error)
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