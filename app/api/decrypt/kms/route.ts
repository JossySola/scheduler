"use server"
import "server-only";
import { decryptKmsDataKey } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export default async function GET (req: NextRequest): Promise<Response> {
    const payload = await req.json();
    const key: string = payload.key;

    if (key) {
        const decryption = await decryptKmsDataKey(key);
        return NextResponse.json({ decryption }, { status: 200 });
    }
    return NextResponse.json({ error: "Missing key" }, { status: 400 })
}