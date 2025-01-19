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
    const values = JSON.stringify(payload.values);
    const specs = JSON.stringify(payload.specs);
    const rows = JSON.stringify(payload.rows);
    const secret = process.env.NEXTAUTH_SECRET;

    console.error("[/api/table/save] VALUES:", values)
    console.error("[/api/table/save] SPECS:", specs)

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
        const response = await pool.query(`
            UPDATE scheduler_users
            SET num_tables = COALESCE(num_tables, 0) + 1
            WHERE id = $1;
        `, [id]);
        console.error(`SAVE ROUTE: ${response}`)
        if (newTable.rowCount === 0) {
            return NextResponse.json({
                status: 400,
                statusText: "Unexpected error occurred"
            })
        }
        
        const newTableId = newTable.rows[0].id;
        return NextResponse.redirect(new URL(`/table/${newTableId}`, process.env.NEXT_PUBLIC_ORIGIN));
    }
    
    await pool.query(`
        UPDATE scheduler_users_tables
        SET table_name = $1,
            table_data = pgp_sym_encrypt($2, $5),
            table_specs = pgp_sym_encrypt($3, $5),
            table_values = pgp_sym_encrypt($4, $5),
            updated_at = NOW()
        WHERE id = $6;
    `, [title, rows, specs, values, secret, table_id]);
    
    console.error("[/api/table/save] Exiting...")
    return NextResponse.json({
        status: 200,
        statusText: "Saved!"
    })
}