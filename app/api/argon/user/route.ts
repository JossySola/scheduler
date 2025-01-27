"use server"
import "server-only";
import { getUserFromDb } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest): Promise<NextResponse> {
    console.error("[/api/argon/user/POST] Starting...")
    const { username, password } = await request.json();
    console.error("[/api/argon/user/POST] Parsed username:", username)
    console.error("[/api/argon/user/POST] Parsed password:", password)
    if (!username || !password) {
        console.error("[/api/argon/user/POST] There is data missing, exiting...")
        return NextResponse.json({ error: 'Missing username or password' }, { status: 409 })
    }

    const user = await getUserFromDb(username, password);
    console.error("[/api/argon/user/POST] Result from getUserFromDb:", user)
    
    if (!user.ok) {
        console.error("[/api/argon/user/POST] User ok property is not true")
        if (user.provider) {
            console.error("[/api/argon/user/POST] There is a provider property:", user.provider);
            console.error("[/api/argon/user/POST] Exiting...")
            return NextResponse.json({ error: user.message }, { status: 400 })
        }
        console.error("[/api/argon/user/POST] Exiting...")
        return NextResponse.json({ error: user.message }, { status: 400 })
    }
    console.error("[/api/argon/user/POST] Exiting...")
    return NextResponse.json({ user: user }, { status: 200 })
}