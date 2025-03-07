"use server"
import "server-only";
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/mocks/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    const id: string = (await params).id;
    // Access headers from the request object
    const headersList: Headers = request.headers;

    // Get the 'client_id' header
    const user_id: string | null= headersList.get('user_id');
    if (!user_id) {
        return NextResponse.json({ error: "Email missing" }, { status: 400 });
    }

    // Access 'id' from params
    const table_id: string = id;

    // Query the database
    try {
        let table = await pool.query(`
            SELECT table_name, 
                   pgp_sym_decrypt(table_data, $3) AS decrypted_table 
            FROM scheduler_users_tables
            WHERE user_id = $1 AND id = $2;
        `, [user_id, table_id, process.env.NEXTAUTH_SECRET]);
        const title: string = table.rows[0].table_name;
        table = JSON.parse(table.rows[0].decrypted_table);

        let specs = await pool.query(`
            SELECT pgp_sym_decrypt_bytea(table_specs, $3) AS decrypted_specs
            FROM scheduler_users_tables
            WHERE user_id = $1 AND id = $2;
        `, [user_id, table_id, process.env.NEXTAUTH_SECRET]);
        specs = JSON.parse(specs.rows[0].decrypted_specs.toString());

        let cols = await pool.query(`
            SELECT pgp_sym_decrypt_bytea(table_cols, $3) AS decrypted_cols
            FROM scheduler_users_tables
            WHERE user_id = $1 AND id = $2;
        `, [user_id, table_id, process.env.NEXTAUTH_SECRET]);
        cols = JSON.parse(cols.rows[0].decrypted_cols.toString());


        let values = await pool.query(`
            SELECT pgp_sym_decrypt_bytea(table_values, $3) AS decrypted_values
            FROM scheduler_users_tables
            WHERE user_id = $1 AND id = $2;
        `, [user_id, table_id, process.env.NEXTAUTH_SECRET]);
        values = JSON.parse(values.rows[0].decrypted_values.toString()).map((value: Array<string>) => {
            return value[1];
        });

        const timestamps = await pool.query(`
            SELECT created_at, updated_at
            FROM scheduler_users_tables
            WHERE user_id = $1 AND id = $2;
        `, [user_id, table_id]).then(result => result.rows[0]);

        return NextResponse.json({ 
            title,
            table,
            specs,
            values,
            cols,
            timestamps,
        }, { status: 200 });
    } catch (error) {
        console.error('[/api/table/[id]] Error:', error);
        return NextResponse.json({ error: "Unexpected error occurred. Try again" }, { status: 400 });
    }
}