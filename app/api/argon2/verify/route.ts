"use server"
import { verifyPasswordAction } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server"

export async function GET (request: NextRequest): Promise<NextResponse> {
    const headersList: Headers = request.headers;
    const hashed: string | null = headersList.get("hashed");
    const password: string | null = headersList.get("password");

    if (!hashed || !password) return NextResponse.json({ error: "Invalid headers" }, { status: 400 });
    const isValid = await verifyPasswordAction(hashed, password);
    return NextResponse.json({ isValid }, { status: 200 });
}