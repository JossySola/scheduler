import { openai } from "@ai-sdk/openai";
import { NextRequest } from "next/server";

export async function POST (request: NextRequest) {
    console.error("[/api/ai] Starting...")
    const payload = await request.json();
    console.error("[/api/ai] Payload:", payload);
    

}