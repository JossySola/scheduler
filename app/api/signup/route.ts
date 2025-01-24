import "server-only";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/mocks/db";
import { Argon2id } from "oslo/password";
import { isPostgreSQLError } from "@/app/lib/definitions";

export async function POST ( request: NextRequest ): Promise<NextResponse> {
    console.error("[/api/signup/POST] Starting...")
    const incoming = await request.json();
    console.error("[/api/signup/POST] JSON parse:", incoming)
    const name: string = incoming.name;
    const username: string = incoming.username;
    const birthday: string = incoming.birthday ? incoming.birthday : null;
    const email: string = incoming.email;
    const password: string = incoming.password ? incoming.password : null;
    const provider: string = incoming.provider ? incoming.provider : null;
    const image: string = incoming.image ? incoming.image : null;

    const argon2id = new Argon2id()
    console.error("[/api/signup/POST] new Argon:", argon2id)
    const hash = password !== null ? await argon2id.hash(incoming.password) : null;
    console.error("[/api/signup/POST] Hashed password:", hash)
    console.error("[/api/signup/POST] Entering try block...")
    try {
        console.error("[/api/signup/POST] Creating Promise...")
        await new Promise<void>(async resolve => {
            console.error("[/api/signup/POST] Starting query...")
            console.error("[/api/signup/POST] Checking if username or email exist...")
            const check = await pool.query(`
                SELECT email FROM scheduler_users
                WHERE email = $1 OR username = $2;
            `, [email, username]);
            console.error("[/api/signup/POST] Query result:", check)
            if (check.rowCount === 0) {
                console.error("[/api/signup/POST] The user doesn't exist yet")
                console.error("[/api/signup/POST] Starting query...")
                console.error("[/api/signup/POST] Inserting new data...")
                const insert = await pool.query(`
                    INSERT INTO scheduler_users (name, username, email, birthday, password)
                    VALUES ($1, $2, $3, $4, $5);
                `, [name, username, email, birthday, hash]);
                console.error("[/api/signup/POST] Insert result:", insert)
                resolve();
            }
            resolve();
        }).then(async (result) => {
            console.error("[/api/signup/POST] Entering .then()...")
            console.error("[/api/signup/POST] Argument passed to .then:", result)
            if (provider) {
                console.error("[/api/signup/POST] The action comes from a provider")
                console.error("[/api/signup/POST] Starting query...")
                console.error("[/api/signup/POST] INSERT data to providers")
                await pool.query(`
                    INSERT INTO scheduler_users_providers (email, provider)
                        VALUES (
                            $1,
                            $2
                        )
                `, [email, provider]);
                const response = await pool.query(`
                    UPDATE scheduler_users
                    SET user_image = $1
                    WHERE email = $2 AND user_image IS NULL;
                `, [image, email]);
                console.error(response)
            }
            console.error("[/api/signup/POST] Exiting .then block...")
        }).catch(error => {
            console.error("[/api/signup/POST] Entering .catch()...")
            return NextResponse.json({ error: `${error}` }, { status: 400 });
        })
        console.error("[/api/signup/POST] Exiting try block...")
        return NextResponse.json({ statusText: "Success!" }, { status: 200 });
    } catch (error: unknown) {
        console.error("[/api/signup/POST] Entering catch block...")
        console.error("[/api/signup/POST] Catch error:", error)
        
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