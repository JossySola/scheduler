"use server"
import "server-only";
import { NextResponse } from 'next/server';
import pool from '@/app/lib/mocks/db';
import { decryptKmsDataKey } from "@/app/lib/utils";
import { sql } from "@vercel/postgres";
import { auth } from "@/auth";
import { AuthenticatedRequest } from "@/middleware";

export const GET =  auth(async function GET(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    if (!req.auth) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    const table_id: string = (await params).id;
    const headersList: Headers = req.headers
    const user_id = headersList.get("user_id");

    try {
        const doesTableExist = await sql`
            SELECT id FROM scheduler_users_tables
            WHERE id = ${table_id};
        `;
        if (!doesTableExist.rows.length || doesTableExist.rowCount === 0) {
            return NextResponse.json({ error: "Table not found" }, { status: 404 });
        }
        const queryKey = await sql`
           SELECT table_data_key FROM scheduler_users_tables
           WHERE user_id = ${user_id} AND id = ${table_id}; 
        `;
        if (queryKey.rowCount === 0) {
            return NextResponse.json({ error: "Internal Error" }, { status: 400 });
        }
        const key = queryKey.rows[0].table_data_key;
        const decryptedKey = await decryptKmsDataKey(key);
        const request = await sql`
            SELECT table_name,
                    pgp_sym_decrypt_bytea(table_data, ${decryptedKey}) AS decrypted_table,
                    pgp_sym_decrypt_bytea(table_rowspecs, ${decryptedKey}) AS decrypted_rowspecs,
                    pgp_sym_decrypt_bytea(table_colspecs, ${decryptedKey}) AS decrypted_colspecs,
                    pgp_sym_decrypt_bytea(table_values, ${decryptedKey}) AS decrypted_values,
                    created_at,
                    updated_at
            FROM scheduler_users_tables
            WHERE user_id = ${user_id} AND id = ${table_id};
        `;
        const data = request.rows[0];
        return NextResponse.json({ 
            title: data.table_name,
            rows: data.decrypted_table,
            rowSpecs: data.decrypted_rowspecs,
            values: data.decrypted_values,
            colSpecs: data.decrypted_colspecs,
            created_at: data.created_at,
            updated_at: data.updated_at,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Unexpected error occurred. Try again" }, { status: 500 });
    }
})