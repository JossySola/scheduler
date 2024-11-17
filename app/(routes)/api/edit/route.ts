import pool from "@/app/lib/mocks/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET (
    request: NextRequest
) {
    
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');
        const result = await pool.query(`
            SELECT * FROM ${id}
            ORDER BY _num;
        `);
        
        return NextResponse.json(result);
    } catch (error) {
        console.error('Database query error:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch data from the database',
                status: 500
            }
        )
    }
}