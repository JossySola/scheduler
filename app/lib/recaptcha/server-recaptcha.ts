'use server'
import "server-only"
import { NextResponse } from "next/server"

export async function ReturnReCAPTCHAError (error: string) {
    'use server'
    if (error === 'timeout-or-duplicate') {
        return NextResponse.json(null, {
            status: 408,
            statusText: 'Too old or has been used previously. (Timeout or duplicate)'
        })
    } else if (error === 'bad-request' || error === 'invalid-input-response' || error === 'invalid-input-secret') {
        return NextResponse.json(null, {
            status: 400,
            statusText: 'Bad request. (Invalid or malformed)'
        })
    } else {
        return NextResponse.json(null, {
            status: 401,
            statusText: 'Unauthorized'
        })
    }
}
export interface reCAPTCHAResponse {
    success: boolean,
    challenge_ts?: string,
    hostname?: string,
    score?: number,
    action?: string,
    "error-codes": Array<'missing-input-secret' | 'invalid-input-secret' | 'missing-input-response' | 'invalid-input-response' | 'bad-request' | 'timeout-or-duplicate'>,
}