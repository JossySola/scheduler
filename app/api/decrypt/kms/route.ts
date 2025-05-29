"use server"
import { decryptKmsDataKey } from "@/app/lib/utils";
import { auth } from "@/auth";
import { AuthenticatedRequest } from "@/middleware";
import { NextResponse } from "next/server";
import "server-only";

export const GET = auth(async function GET (req: AuthenticatedRequest): Promise<Response> {
    const payload = await req.json();
    const key: string = payload.key;

    if (key) {
        const decryption = await decryptKmsDataKey(key);
        return NextResponse.json({ decryption }, { status: 200 });
    }
    return NextResponse.json({ error: "Missing key" }, { status: 400 })
})