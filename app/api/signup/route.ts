import { NextRequest } from "next/server";
import "server-only";

export async function POST (
    request: NextRequest
) {
    console.log(request)

    return true
}