import pool from "@/app/lib/mocks/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest): Promise<NextResponse> {
    const payload = await request.json();
    const username: string = payload.username;
    const email: string = payload.email;

    console.error("[/api/verify/user/POST] Request parsed:", payload)
    console.error("[/api/verify/user/POST] Checking if necessary data exists...")
    if (!payload || !username || !email) {
        console.error("[/api/verify/user/POST] Data is missing, returning...")
        return NextResponse.json({ error: 'Payload missing' }, { status: 400 });
    }
    console.error("[/api/verify/user/POST] Starting query...")
    console.error("[/api/verify/user/POST] Checking if username exists...")
    const checkUsername = await pool.query(`
        SELECT EXISTS (
            SELECT 1
            FROM scheduler_users
            WHERE username = $1
        ) AS username_exists;
    `, [username]);

    const usernameExists = checkUsername.rows[0].username_exists;
    console.error("[/api/verify/user/POST] Query result:", usernameExists)

    console.error("[/api/verify/user/POST] Starting query...")
    console.error("[/api/verify/user/POST] Checking if email exists...")
    const checkEmail = await pool.query(`
        SELECT EXISTS (
            SELECT 1
            FROM scheduler_users
            WHERE email = $1
        ) AS email_exists;
    `, [email]);
    

    const emailExists = checkEmail.rows[0].email_exists;
    console.error("[/api/verify/user/POST] Query result:", emailExists)

    if (!checkUsername || !emailExists) {
        console.error("[/api/verify/user/POST] Email or username does not exist on table")
        return NextResponse.json({ error: 'Unexpected error' }, { status: 400 });
    }

    if (usernameExists) {
        console.error("[/api/verify/user/POST] Username already exists")
        return NextResponse.json({ statusText: 'User already exists' }, { status: 200 });
    }

    if(emailExists) {
        console.error("[/api/verify/user/POST] Email already exists")
        return NextResponse.json({ statusText: 'Email already in use' }, { status: 200 });
    }
    console.error("[/api/verify/user/POST] Exiting...")
    return NextResponse.json({ error: 'User found' }, { status: 404 })
}