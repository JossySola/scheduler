"use server"
import { verifyPasswordAction } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server"

export async function POST (request: NextRequest): Promise<NextResponse> {
    const payload = await request.json();
    const hashed: string | null = payload.hashed;
    const password: string | null = payload.password;

    if (!hashed || !password) return NextResponse.json({ error: "Invalid headers" }, { status: 400 });
    const isValid = await verifyPasswordAction(hashed, password);
    return NextResponse.json({ isValid }, { status: 200 });
}