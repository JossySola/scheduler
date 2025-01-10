import { getUserFromDb } from "@/app/lib/utils-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest) {
    console.error("[/api/argon/user/POST] Starting...")
    const { username, password } = await request.json();
    console.error("[/api/argon/user/POST] Parsed username:", username)
    console.error("[/api/argon/user/POST] Parsed password:", password)
    if (!username || !password) {
        console.error("[/api/argon/user/POST] There is data missing, exiting...")
        return NextResponse.json({
            status: 409,
            statusText: 'Missing username or password',
        })
    }

    const user = await getUserFromDb(username, password);
    console.error("[/api/argon/user/POST] Result from getUserFromDb:", user)
    
    if (!user.ok) {
        console.error("[/api/argon/user/POST] User ok property is not true")
        if (user.provider) {
            console.error("[/api/argon/user/POST] There is a provider property:", user.provider);
            console.error("[/api/argon/user/POST] Exiting...")
            throw new Error(`${user.message}`, {
                cause: {
                    details: `${user.provider}`
                }
            })
        }
        console.error("[/api/argon/user/POST] Exiting...")
        throw new Error(`${user.message}`)
    }
    console.error("[/api/argon/user/POST] Exiting...")
    return NextResponse.json({
        status: 200,
        user: user,
    })
}