'use server'
import pool from "@/app/lib/mocks/db";
import { NextRequest } from "next/server";

export const revalidate = 60;

export async function GET (
    request: NextRequest,
    { params }: { params: Promise<{id: string}> }
) {
    console.log(request)
    const id = (await params).id;
    const res = await pool.query(`
        SELECT * FROM ${id}
        ORDER BY _num;
    `);
    return Response.json(res);
}