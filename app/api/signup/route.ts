"use server"
import "server-only";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/mocks/db";
import { Argon2id } from "oslo/password";
import { isPostgreSQLError } from "@/app/lib/definitions";

export async function POST ( request: NextRequest ): Promise<NextResponse> {
    const incoming = await request.json();
    
    const name: string = incoming.name;
    const username: string = incoming.username;
    const birthday: string = incoming.birthday ? incoming.birthday : null;
    const email: string = incoming.email;
    const password: string = incoming.password ? incoming.password : null;
    const provider: string = incoming.provider ? incoming.provider : null;
    const image: string = incoming.image ? incoming.image : null;

    const argon2id = new Argon2id()
    const hash = password !== null ? await argon2id.hash(incoming.password) : null;
    
    try {
        await new Promise<void>(async resolve => {
            const check = await pool.query(`
                SELECT email FROM scheduler_users
                WHERE email = $1 OR username = $2;
            `, [email, username]);
            
            if (check.rowCount === 0) {
                const insert = await pool.query(`
                    INSERT INTO scheduler_users (name, username, email, birthday, password)
                    VALUES ($1, $2, $3, $4, $5);
                `, [name, username, email, birthday, hash]);
                resolve();
            }
            resolve();
        }).then(async (result) => {
            if (provider) {
                await pool.query(`
                    INSERT INTO scheduler_users_providers (email, provider)
                        VALUES (
                            $1,
                            $2
                        );
                `, [email, provider]);

                await pool.query(`
                    UPDATE scheduler_users
                    SET user_image = $1
                    WHERE email = $2 AND user_image IS NULL;
                `, [image, email]);
            }
        }).catch(error => {
            return NextResponse.json({ error: `${error}` }, { status: 400 });
        })
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