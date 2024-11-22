import "server-only";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/mocks/db";

export async function GET (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;
    const data = await pool.query(`
        SELECT * FROM ${id}
        ORDER BY _num;
    `);
    return NextResponse.json(data);
}