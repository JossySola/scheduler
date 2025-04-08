"use server"
import "server-only";
import pool from "@/app/lib/mocks/db";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { decryptKmsDataKey, generateKmsDataKey } from "@/app/lib/utils";
import { revalidatePath } from "next/cache";

export async function POST (request: NextRequest): Promise<NextResponse> {
    const locale = request.headers.get("x-user-locale") || "en";
    const payload = await request.json();
    const user_id: string = payload.user_id;
    const table_id: string = payload.table_id;
    const title: string = payload.table_title ? payload.table_title : locale === "es" ? "Sin título" : "No title yet";
    const rows: string = JSON.stringify(payload.rows);
    const values: string = JSON.stringify(payload.values);
    const colSpecs: string = JSON.stringify(payload.colSpecs);
    const rowSpecs: string = JSON.stringify(payload.rowSpecs);

    if (!table_id) {
        if (!user_id) {
            return NextResponse.json({
                error: "Unauthorized"
            }, { status: 401 });
        }
        const key = await generateKmsDataKey();
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
            INSERT INTO scheduler_users_tables (user_id, table_name, table_data, table_rowspecs, table_values, table_colspecs, table_data_key)
            VALUES (
                $1,
                $2,
                pgp_sym_encrypt($3, $7),
                pgp_sym_encrypt($4, $7),
                pgp_sym_encrypt($5, $7),
                pgp_sym_encrypt($6, $7),
                $8
            )
            RETURNING id;
        `, [user_id, title, rows, rowSpecs, values, colSpecs, key?.Plaintext, key?.CiphertextBlob]);
        
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
    const queryKey = await pool.query(`
        SELECT table_data_key FROM scheduler_users_tables 
        WHERE id = $1 AND user_id = $2;
    `, [table_id, user_id]);
    if (queryKey.rowCount === 0) {
        return NextResponse.json("Invalid key", { status: 500 });
    }
    const key = queryKey.rows[0].table_data_key;
    const decryptedKey = await decryptKmsDataKey(key);
    const update = await pool.query(`
        UPDATE scheduler_users_tables
        SET table_name = $1,
            table_data = pgp_sym_encrypt($2, $6),
            table_rowSpecs = pgp_sym_encrypt($3, $6),
            table_values = pgp_sym_encrypt($4, $6),
            table_colSpecs = pgp_sym_encrypt($5, $6),
            updated_at = NOW()
        WHERE id = $7 AND user_id = $8;
    `, [title, rows, rowSpecs, values, colSpecs, decryptedKey, table_id, user_id]);
    if (update.rowCount === 0) {
        return NextResponse.json({
            error: "Failed to update"
        }, { status: 400 });
    }
    revalidatePath(`/${locale}/table/${table_id}`);
    return NextResponse.json(" ", { status: 200 });
}