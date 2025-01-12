import pool from "@/app/lib/mocks/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest) {
    console.error("[/api/table/save] Starting...")
    const payload = await request.json();
    console.error("[/api/table/save] Payload:", payload)
    const user_id= payload.user_id;
    const title = payload.title;
    const rows = JSON.stringify(payload.rows);
    const secret = process.env.NEXTAUTH_SECRET;

    const insert = await pool.query(`
        INSERT INTO scheduler_users_tables (user_id, table_name, table_data)
        VALUES (
            $1,
            $2,
            pgp_sym_encrypt($3, $4)
        );
    `, [user_id, title, rows, secret])

    console.error("[/api/table/save] Exiting...")
    return NextResponse.json({
        status: 200
    })
}