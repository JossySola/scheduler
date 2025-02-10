"use server"
import "server-only"
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/mocks/db";

export async function GET (request: NextRequest) {
    const locale = request.headers.get("x-user-locale") || "en";
    const headersList = await headers();
    const user_email = headersList.get("user_email")?.toString();
    const table_id = headersList.get("table_id")?.toString();

    if (!user_email || !table_id) {
        return NextResponse.json({
            error: "Data missing"
        }, { status: 400 })
    }

    const idRequest = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/user/id`, {
        method: "GET",
        headers: {
            user_email
        }
    })
    const response = await idRequest.json();
    
    if (!response.data.user_id) {
        return NextResponse.json({
            error: "User not found"
        }, { status: 404 })
    }
    const user_id = response.data.user_id;

    const deletion = await pool.query(`
        DELETE FROM scheduler_users_tables
        WHERE user_id = $1 AND id = $2;
    `, [user_id, table_id]);
    
    if (deletion.rowCount === 0) {
        return NextResponse.json({
            error: "Failed to delete table"
        }, { status: 400 })
    }

    const update = await pool.query(`
        UPDATE scheduler_users
        SET num_tables = GREATEST(num_tables - 1, 0)
        WHERE email = $1;
    `, [user_email]);
    
    if (update.rowCount === 0) {
        return NextResponse.json({
            error: "Failed to update count"
        }, { status: 500 });
    }
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
}