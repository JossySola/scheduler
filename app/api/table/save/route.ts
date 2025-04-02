"use server"
import "server-only";
import pool from "@/app/lib/mocks/db";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function POST (request: NextRequest): Promise<NextResponse> {
    const locale = request.headers.get("x-user-locale") || "en";
    const payload = await request.json();
    const user_id: string = payload.user_id;
    const table_id: string = payload.table_id;
    const title: string = payload.table_title ? payload.table_title : locale === "es" ? "Sin título" : "No title yet";
    const rows: string = JSON.stringify(payload.rows);
    const values: string = JSON.stringify(payload.values);
    const colSpecs: string = JSON.stringify(payload.colSpecs);
    const specs: string = JSON.stringify(payload.specs);
    const secret: string | undefined = process.env.NEXTAUTH_SECRET;
    if (!secret) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
    if (!table_id) {
        if (!user_id) {
            return NextResponse.json({
                error: "Unauthorized"
            }, { status: 401 });
        }
        const getNumTables = await pool.query(`
            SELECT num_tables FROM scheduler_users
            WHERE id = $1;
        `, [user_id]);
        if (getNumTables.rowCount === 0) {
            return NextResponse.json({
                error: "User not found"
            }, { status: 404 });
        }
        if(getNumTables.rows[0].num_tables === 3) {
            return NextResponse.json({
                error: "Maximum num of tables reached"
            }, { status: 403 });
        }
        const newTable = await pool.query(`
            INSERT INTO scheduler_users_tables (user_id, table_name, table_data, table_specs, table_values, table_cols)
            VALUES (
                $1,
                $2,
                pgp_sym_encrypt($3, $7),
                pgp_sym_encrypt($4, $7),
                pgp_sym_encrypt($5, $7),
                pgp_sym_encrypt($6, $7)
            )
            RETURNING id;
        `, [user_id, title, rows, specs, values, colSpecs, secret]);
        if (newTable.rowCount === 0) {
            return NextResponse.json({
                error: "Failed to insert"
            }, { status: 500 });
        }
        const updateCount = await pool.query(`
            UPDATE scheduler_users
            SET num_tables = COALESCE(num_tables, 0) + 1
            WHERE id = $1;
        `, [user_id]);
        return redirect(`/${locale}/table/${newTable.rows[0].id}`);
    }

    if (!user_id) {
        return NextResponse.json({
            error: "Unauthenticated or missing id"
        }, { status: 400 });
    }
    const update = await pool.query(`
        UPDATE scheduler_users_tables
        SET table_name = $1,
            table_data = pgp_sym_encrypt($2, $6),
            table_specs = pgp_sym_encrypt($3, $6),
            table_values = pgp_sym_encrypt($4, $6),
            table_cols = pgp_sym_encrypt($5, $6),
            updated_at = NOW()
        WHERE id = $7 AND user_id = $8;
    `, [title, rows, specs, values, colSpecs, secret, table_id, user_id]);
    if (update.rowCount === 0) {
        return NextResponse.json({
            error: "Failed to update"
        }, { status: 400 });
    }
    return NextResponse.json(" ", { status: 200 });
}