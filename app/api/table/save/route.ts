import pool from "@/app/lib/mocks/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest) {
    console.error("[/api/table/save] Starting...")
    const payload = await request.json();
    console.error("[/api/table/save] Payload:", payload)
    const user_id = payload.user_id;
    const user_email = payload.user_email;
    const table_id = payload.table_id;
    const title = payload.title;
    const values = payload.values;
    const specs = payload.specs;
    const rows = JSON.stringify(payload.rows);
    const secret = process.env.NEXTAUTH_SECRET;

    const tableLimit = await pool.query(`
        SELECT num_tables, id FROM scheduler_users
        WHERE $1 = id OR $2 = email;
    `, [user_id, user_email])
    if (tableLimit.rowCount === 0) {
        return NextResponse.json({
            status: 404,
            statusText: "User not found"
        })
    }
    const { num_tables, id } = tableLimit.rows[0];

    if (!table_id) {
        if (num_tables >= 3) {
            return NextResponse.json({
                status: 400,
                statusText: "Number of tables limit reached"
            })
        }

        const newTable = await pool.query(`
            INSERT INTO scheduler_users_tables (user_id, table_name, table_data, table_specs, table_values)
            VALUES (
                $1,
                $2,
                pgp_sym_encrypt($3, $6),
                pgp_sym_encrypt($4, $6),
                pgp_sym_encrypt($5, $6)
            )
            RETURNING id;
        `, [id, title, rows, specs, values, secret]);
        if (newTable.rowCount === 0) {
            return NextResponse.json({
                status: 400,
                statusText: "Unexpected error occurred"
            })
        }
        
        const newTableId = newTable.rows[0].id;
        return NextResponse.redirect(new URL(`/table/${newTableId}`, process.env.NEXT_PUBLIC_ORIGIN));
    }
    // case 1: table already exists
    // case 2: its the first time table is saved (creation)
    
    console.error("[/api/table/save] Exiting...")
    return NextResponse.json({
        status: 200
    })
}