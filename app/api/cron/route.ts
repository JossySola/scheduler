"use server"
import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(request: NextRequest) {
    if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 } )
    }
    await sql`
    DELETE FROM scheduler_email_confirmation_tokens
    WHERE expires_at < NOW();`;
    await sql`
    DELETE FROM scheduler_password_resets
    WHERE expires_at < NOW();`;
    return NextResponse.json({ ok: true });
}