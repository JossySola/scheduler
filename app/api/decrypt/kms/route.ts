"use server"
import "server-only";
import { decryptKmsDataKey } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req: NextRequest): Promise<Response> {
    const headersList: Headers = req.headers
    const key = headersList.get("key");
    if (key) {
        const decryption = await decryptKmsDataKey(key);
        return NextResponse.json({ decryption }, { status: 200 });
    }
    return NextResponse.json({ error: "Missing key" }, { status: 400 })
}