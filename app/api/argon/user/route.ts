import { getUserFromDb } from "@/app/lib/utils-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest) {
    const { username, password } = await request.json();
    
    if (!username || !password) {
        return NextResponse.json({
            status: 409,
            statusText: 'Missing username or password (route)',
        })
    }

    try {
        const user = await getUserFromDb(username, password);
        
        if (!user) {
            return NextResponse.json({
                status: 401,
                statusText: 'Invalid credentials (route)',
            })
        }
        return NextResponse.json({
            status: 200,
            user: user,
        })
    } catch (error) {
        return NextResponse.json({
            status: 400,
            statusText: 'Unexpected error (route)'
        })
    }
}