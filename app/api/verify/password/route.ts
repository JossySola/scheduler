"use server"
import "server-only";
import { NextResponse } from "next/server";
import { Argon2id } from "oslo/password";
import { auth } from "@/auth";
import { AuthenticatedRequest } from "@/middleware";

export const GET = auth(async function GET (req: AuthenticatedRequest): Promise<NextResponse> {
    const payload = await req.json();
    const password: string = payload.password;
    const decrypted: string = payload.decrypted;
    
    const argon = new Argon2id();
    const verify = await argon.verify(decrypted, password);

    if (!verify) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 403 })
    }

    return NextResponse.json({ statusText: 'Granted' }, { status: 200 });
})