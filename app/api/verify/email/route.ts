import pool from "@/app/lib/mocks/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const payload = await request.json();

    if (!payload || !payload.confirmation_token || !payload.email) {
        return NextResponse.json({
            status: 400,
            statusText: 'Data missing'
        })
    }

    const query = await pool.query(`
        UPDATE scheduler_users
            SET verified = true
            WHERE verified_token = $1 AND email = $2;
    `, [payload.confirmation_token, payload.email]);

    if(!query || query.rowCount === 0) {
        return NextResponse.json({
            status: 400,
            statusText: 'Invalid or expired token'
        })
    }

    await pool.query(`
        UPDATE scheduler_users
            SET verify_token = ''
            WHERE email = $1;
    `, [payload.email]);

    return NextResponse.json({
        status: 200,
        statusText: 'Token validated'
    })
}