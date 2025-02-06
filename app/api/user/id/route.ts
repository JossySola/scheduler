"use server"
import "server-only"
import pool from "@/app/lib/mocks/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const headersList = await headers();
    const email = headersList.get("user_email");

    if (!email) {
        return NextResponse.json({
            error: "User email missing"
        }, { status: 400 })
    }

    const response = await pool.query(`
        SELECT id as user_id
        FROM scheduler_users
        WHERE email = $1;
    `, [email]);

    if (response.rowCount === 0) {
        return NextResponse.json({
            error: "User not found"
        }, { status: 404 })
    }
    
    return NextResponse.json({
        data: response.rows[0]
    }, { status: 200 })
}