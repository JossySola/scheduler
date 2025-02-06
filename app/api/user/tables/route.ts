"use server"
import "server-only"
import pool from "@/app/lib/mocks/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET () {
    const headersList = await headers();
    const user_id = headersList.get("user_id");

    if (!user_id) {
        return NextResponse.json({
            error: "User ID missing"
        }, { status: 400 })
    }
    const tables = await pool.query(`
        SELECT id as table_id, table_name, updated_at
        FROM scheduler_users_tables
        WHERE user_id = $1;
    `, [user_id]);

    if (tables.rowCount === 0) {
        return NextResponse.json({
            error: "Not found"
        }, { status: 404 });
    }
    
    return NextResponse.json({
        data: [tables.rows[0]]
    }, { status: 200 })
}