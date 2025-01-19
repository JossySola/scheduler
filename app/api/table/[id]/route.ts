"use server"
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/mocks/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    console.error('[/api/table/[id]] Starting...');
    const id = (await params).id;
    // Access headers from the request object
    const headersList = request.headers;

    console.error('[/api/table/[id]] Headers:', headersList);

    // Get the 'client_id' header
    const client_email = headersList.get('client_email');
    console.error('[/api/table/[id]] Client ID:', client_email);

    // Access 'id' from params
    const table_id = id;
    console.error('[/api/table/[id]] Table ID:', table_id);

    // Query the database
    try {
        console.error('[/api/table/[id]] Querying...');
        const user = await pool.query(`
            SELECT id FROM scheduler_users WHERE email = $1;
        `, [client_email]);
        const client_id = user.rows[0].id;

        let table = await pool.query(`
            SELECT table_name, 
                   pgp_sym_decrypt_bytea(table_data, $3) AS decrypted_table 
            FROM scheduler_users_tables
            WHERE user_id = $1 AND id = $2;
        `, [client_id, table_id, process.env.NEXTAUTH_SECRET]);
        console.error('[/api/table/[id]] rows:', table.rows[0]);
        const title = table.rows[0].table_name;
        console.error('[/api/table/[id]] Title:', title);
        table = JSON.parse(table.rows[0].decrypted_table.toString())
        console.error('[/api/table/[id]] Table:', table);

        let specs = await pool.query(`
            SELECT pgp_sym_decrypt_bytea(table_specs, $3) AS decrypted_specs
            FROM scheduler_users_tables
            WHERE user_id = $1 AND id = $2;
        `, [client_id, table_id, process.env.NEXTAUTH_SECRET]);
        specs = JSON.parse(specs.rows[0].decrypted_specs.toString())
        console.error('[/api/table/[id]] Specs:', specs);

        let values = await pool.query(`
            SELECT pgp_sym_decrypt_bytea(table_values, $3) AS decrypted_values
            FROM scheduler_users_tables
            WHERE user_id = $1 AND id = $2;
        `, [client_id, table_id, process.env.NEXTAUTH_SECRET]);
        values = JSON.parse(values.rows[0].decrypted_values.toString()).map((value: Array<string>) => {
            return value[1];
        })
        console.error('[/api/table/[id]] Values:', values);

        return NextResponse.json({
            status: 200,
            title,
            table,
            specs,
            values,
        });
    } catch (error) {
        console.error('[/api/table/[id]] Error:', error);
        return NextResponse.json({
            status: 400,
            statusText: "Unexpected error occurred. Try again"
        });
    }
}