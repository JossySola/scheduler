"use server"
import "server-only";
import { NextResponse } from "next/server";
import { Argon2id } from "oslo/password";
import { auth } from "@/auth";
import { AuthenticatedRequest } from "@/middleware";

export const GET = auth(async function GET (req: AuthenticatedRequest): Promise<NextResponse> {
    const headersList: Headers = req.headers;
    const password: string | null = headersList.get("password");
    const decrypted: string | null = headersList.get("decrypted");  
    if (!password || !decrypted) {
        return NextResponse.json({ error: 'Missing data to verify' }, { status: 400 });
    }
    const argon = new Argon2id();
    const verify = await argon.verify(decrypted, password);
    if (!verify) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 403 })
    }
    return NextResponse.json({ statusText: 'Granted' }, { status: 200 });
})