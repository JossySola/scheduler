"use server"
import "server-only"
import pool from "@/app/lib/mocks/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const locale = request.headers.get("x-user-locale") || "en";
    const headersList = await headers();
    const email = headersList.get("user_email");

    if (!email) NextResponse.json({
        error: "Unauthenticated"
    }, { status: 401 })

    try {
        const requestId = await pool.query(`
            SELECT id FROM scheduler_users
            WHERE email = $1;    
        `, [email]);
        if (!requestId || requestId.rowCount === 0) {
            return NextResponse.json({
                error: "User not found"
            }, { status: 404 })
        }
        const user_id = requestId.rows[0].id;
    
        const deleteTables = await pool.query(`
            DELETE FROM scheduler_users_tables
            WHERE user_id = $1;
        `, [user_id])
    
        const deleteProviders = await pool.query(`
            DELETE FROM scheduler_users_providers
            WHERE email = $1;
        `, [email])
    
        const deleteAttempts = await pool.query(`
            DELETE FROM scheduler_login_attempts
            WHERE email = $1;
        `, [email])
    
        const deleteConfirmations = await pool.query(`
            DELETE FROM scheduler_email_confirmation_tokens
            WHERE email = $1;
        `, [email])
    
        const deleteUser = await pool.query(`
            UPDATE scheduler_users
            SET 
                name = '[deleted user]',
                username = CONCAT('deleted_', id), -- Keeps it unique
                email = CONCAT(id, '@deleted.com'), -- Keeps it unique
                birthday = NULL,
                password = NULL,
                user_password_key = CONCAT('deleted_', id), -- Keeps it unique
                deleted_at = NOW(),
                user_image = NULL
            WHERE email = $1;
        `, [email]);
        return NextResponse.redirect(new URL(`/${locale}/signup`, request.url));
    } catch (e) {
        return NextResponse.json({
            error: "Server failure"
        }, { status: 500 })
    }
}