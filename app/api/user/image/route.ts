"use server"
import "server-only"
import pool from "@/app/lib/mocks/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET () {
    const headersList = await headers();
    const email = headersList.get("user_email")?.toString();

    if (!email) NextResponse.json({
        error: "No session provided"
    }, { status: 400 });

    const query = await pool.query(`
        SELECT user_image
        FROM scheduler_users
        WHERE email = $1;
    `, [email]);

    if (query.rowCount === 0) NextResponse.json({
        error: "Query failed"
    }, { status: 500 });

    return NextResponse.json(query.rows[0], { status: 200 });
}