"use server"
import "server-only";
import pool from "@/app/lib/mocks/db";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { decryptKmsDataKey, generateKmsDataKey } from "@/app/lib/utils";
import { sql } from "@vercel/postgres";
import { AuthenticatedRequest } from "@/middleware";
import { auth } from "@/auth";

export const POST = auth(async function POST(req: AuthenticatedRequest): Promise<NextResponse> {
    if (!req.auth) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    
    const locale = req.headers.get("x-user-locale") || "en";
    const payload = await req.json();
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
        const getNumTables = await sql`
            SELECT num_tables FROM scheduler_users
            WHERE id = ${user_id};
        `;
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
        const newTable = await sql`
            INSERT INTO scheduler_users_tables (user_id, table_name, table_data, table_rowspecs, table_values, table_colspecs, table_data_key)
            VALUES (
                ${user_id},
                ${title},
                pgp_sym_encrypt(${rows}, ${key?.Plaintext}),
                pgp_sym_encrypt(${rowSpecs}, ${key?.Plaintext}),
                pgp_sym_encrypt(${values}, ${key?.Plaintext}),
                pgp_sym_encrypt(${colSpecs}, ${key?.Plaintext}),
                ${key?.CiphertextBlob}
            )
            RETURNING id;
        `;
        
        if (newTable.rowCount === 0) {
            return NextResponse.json({
                error: "Failed to insert"
            }, { status: 500 });
        }
        const updateCount = await sql`
            UPDATE scheduler_users
            SET num_tables = COALESCE(num_tables, 0) + 1
            WHERE id = ${user_id};
        `;
        return redirect(`${process.env.NEXT_PUBLIC_ORIGIN}/${locale}/table/${newTable.rows[0].id}`);
    }

    if (!user_id) {
        return NextResponse.json({
            error: "Unauthenticated or missing id"
        }, { status: 400 });
    }
    const queryKey = await sql`
        SELECT table_data_key FROM scheduler_users_tables 
        WHERE id = ${table_id} AND user_id = ${user_id};
    `;
    if (queryKey.rowCount === 0) {
        return NextResponse.json("Invalid key", { status: 500 });
    }
    const key = queryKey.rows[0].table_data_key;
    const decryptedKey = await decryptKmsDataKey(key);
    const update = await sql`
        UPDATE scheduler_users_tables
        SET table_name = ${title},
            table_data = pgp_sym_encrypt(${rows}, ${decryptedKey}),
            table_rowspecs = pgp_sym_encrypt(${rowSpecs}, ${decryptedKey}),
            table_values = pgp_sym_encrypt(${values}, ${decryptedKey}),
            table_colspecs = pgp_sym_encrypt(${colSpecs}, ${decryptedKey}),
            updated_at = NOW()
        WHERE id = ${table_id} AND user_id = ${user_id};
    `;
    if (update.rowCount === 0) {
        return NextResponse.json({
            error: "Failed to update"
        }, { status: 400 });
    }
    return NextResponse.json(" ", { status: 200 });
})