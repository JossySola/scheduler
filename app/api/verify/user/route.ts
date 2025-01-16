import pool from "@/app/lib/mocks/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest) {
    const payload = await request.json();
    console.error("[/api/verify/user/POST] Request parsed:", payload)
    console.error("[/api/verify/user/POST] Checking if necessary data exists...")
    if (!payload || !payload.username || !payload.email) {
        console.error("[/api/verify/user/POST] Data is missing, returning...")
        return NextResponse.json({
            status: 400,
            statusText: 'Payload missing'
        })
    }
    console.error("[/api/verify/user/POST] Starting query...")
    console.error("[/api/verify/user/POST] Checking if username exists...")
    const checkUsername = await pool.query(`
        SELECT EXISTS (
            SELECT 1
            FROM scheduler_users
            WHERE username = $1
        ) AS username_exists;
    `, [payload.username]);

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
    `, [payload.email]);
    

    const emailExists = checkEmail.rows[0].email_exists;
    console.error("[/api/verify/user/POST] Query result:", emailExists)

    if (!checkUsername || !emailExists) {
        console.error("[/api/verify/user/POST] Email or username does not exist on table")
        return NextResponse.json({
            status: 400,
            statusText: 'Unexpected error'
        })
    }

    if (usernameExists) {
        console.error("[/api/verify/user/POST] Username already exists")
        return NextResponse.json({
            status: 200,
            statusText: 'User already exists'
        })
    }

    if(emailExists) {
        console.error("[/api/verify/user/POST] Email already exists")
        return NextResponse.json({
            status: 200,
            statusText: 'Email already in use'
        })
    }
    console.error("[/api/verify/user/POST] Exiting...")
    return NextResponse.json({
        status: 404,
        statusText: 'User found'
    })
}