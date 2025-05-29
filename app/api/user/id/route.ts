"use server"
import "server-only"
import pool from "@/app/lib/mocks/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { auth } from "@/auth";
import { AuthenticatedRequest } from "@/middleware";

export const GET = auth(async function GET(req: AuthenticatedRequest) {
    if (!req.auth) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    
    const headersList = await headers();
    const email = headersList.get("user_email");

    if (!email) {
        return NextResponse.json({
            error: "User email missing"
        }, { status: 400 })
    }

    const response = await sql`
        SELECT id as user_id
        FROM scheduler_users
        WHERE email = ${email};
    `;

    if (response.rowCount === 0) {
        return NextResponse.json({
            error: "User not found"
        }, { status: 404 })
    }
    
    return NextResponse.json({
        data: response.rows[0]
    }, { status: 200 })
})