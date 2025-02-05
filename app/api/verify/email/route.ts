"use server"
import "server-only";
import pool from "@/app/lib/mocks/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
    const payload = await request.json();
    const confirmation_token: string = payload.confirmation_token;
    const email: string = payload.email;

    if (!payload || !confirmation_token || !email) {
        return NextResponse.json({ error: 'Data missing' }, { status: 400 });
    }

    const query = await pool.query(`
        UPDATE scheduler_users
            SET verified = true
            WHERE verified_token = $1 AND email = $2;
    `, [confirmation_token, email]);

    if(!query || query.rowCount === 0) {
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    await pool.query(`
        UPDATE scheduler_users
            SET verify_token = ''
            WHERE email = $1;
    `, [payload.email]);

    return NextResponse.json({ statusText: 'Token validated' }, { status: 200 });
}