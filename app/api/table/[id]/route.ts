"use server"
import "server-only";
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/mocks/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    const table_id: string = (await params).id;
    const headersList: Headers = request.headers
    const user_id = headersList.get("user_id");
    const secret = process.env.NEXTAUTH_SECRET;

    try {
        const request = await pool.query(`
            SELECT table_name,
                    pgp_sym_decrypt_bytea(table_data, $3) AS decrypted_table,
                    pgp_sym_decrypt_bytea(table_specs, $3) AS decrypted_specs,
                    pgp_sym_decrypt_bytea(table_cols, $3) AS decrypted_colspecs,
                    pgp_sym_decrypt_bytea(table_values, $3) AS decrypted_values,
                    created_at,
                    updated_at
            FROM scheduler_users_tables
            WHERE user_id = $1 AND id = $2;
        `, [user_id, table_id, secret]);
        const data = request.rows[0];
        return NextResponse.json({ 
            title: data.table_name,
            rows: data.decrypted_table,
            specs: data.decrypted_specs,
            values: data.decrypted_values,
            colSpecs: data.decrypted_colspecs,
            created_at: data.created_at,
            updated_at: data.updated_at,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Unexpected error occurred. Try again" }, { status: 400 });
    }
}