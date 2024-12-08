import "server-only"
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/mocks/db";

export async function POST (
    request: NextRequest,
) {
    const {
        id,
        columns,
        columnsParams,
        rows,
    } = await request.json();
    
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS ${id} (
            _num integer,
            ${columns}
            );
        `)
        await Promise.all(
            rows.map(async (rowValues: Array<string>, i: number) => {
                const placeholders = rowValues.map((_: string, index: number) => `$${index + 1}`).join(', ');
                return pool.query(
                    `INSERT INTO ${id} (_num, ${columnsParams}) VALUES (${i}, ${placeholders})`,
                    rowValues
                )
            })
        )
        return NextResponse.json({
            success: true,
            code: 201,
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: `${error.message}`,
            code: 500,
        })
    }
}