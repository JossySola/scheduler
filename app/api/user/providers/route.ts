import pool from "@/app/lib/mocks/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET () {
    const headersList = await headers();
    const email = headersList.get("user_email")?.toString();

    if (!email) {
        return NextResponse.json({
            error: "No session provided"
        }, { status: 400 })
    }

    const query = await pool.query(`
        SELECT provider FROM scheduler_users_providers
        WHERE email = $1;
    `, [email]);
    if (query.rowCount === 0) {
        return NextResponse.json({
            error: "No providers found"
        }, { status: 404 })
    }

    return NextResponse.json({
        data: query.rows
    }, { status: 200 });
}