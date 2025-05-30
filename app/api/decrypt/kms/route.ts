"use server"
import "server-only";
import { decryptKmsDataKey } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req: NextRequest): Promise<Response> {
    const payload = await req.json();
    console.log("📄 Payload: ", payload)
    const key: string = payload.key;
    console.log("🔑 Key: ", key)
    if (key) {
        const decryption = await decryptKmsDataKey(key);
        console.log("🔐 Decryption: ", decryption)
        return NextResponse.json({ decryption }, { status: 200 });
    }
    return NextResponse.json({ error: "Missing key" }, { status: 400 })
}