import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }
    return NextResponse.next();
}
export const config = {
    matcher: ["/dashboard"],
}