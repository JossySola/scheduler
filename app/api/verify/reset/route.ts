import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/mocks/db";
import { z } from "zod";
import { Argon2id } from "oslo/password";

export async function POST(request: NextRequest): Promise<NextResponse> {
    const payload = await request.json();
    const action: string= payload.action;
    const verification_token: string = payload.verification_token;
    const email: string = payload.email;
    const password: string = payload.password;
    
    switch(action) {
        case 'verify-token': {
            if (!verification_token || !email) {
                return NextResponse.json({ error: 'The confirmation token must be provided' }, { status: 400 })
            }
        
            if (verification_token.length < 6 || verification_token.length > 6) {
                return NextResponse.json({ error: 'The token must be 6 characters in length' }, { status: 406 })
            }
        
            const validate = await pool.query(`
                UPDATE scheduler_email_confirmation_tokens
                    SET used_at = NOW()
                    WHERE token = $1 AND email = $2;
            `, [verification_token, email]);
        
            if (validate.rowCount === 0) {
                return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
            }
            return NextResponse.json({ statusText: 'Token confirmed!' }, { status: 200 })
        };
        case 'password-reset': {
            if (!password) {
                return NextResponse.json({ error: 'Empty password' }, { status: 400 })
            }
            if (password.length < 8) {
                return NextResponse.json({ error: 'Password must have at least 8 characters' }, { status: 400 })
            }

            const validate = z.string().min(1).email().safeParse(email);
            if (!validate) {
                return NextResponse.json({ error: 'Invalid e-mail' }, { status: 400 })
            }

            const argon = new Argon2id();
            const hash: string = await argon.hash(password)

            const reset = await pool.query(`
                UPDATE scheduler_users
                    SET password = $1
                    WHERE email = $2;
            `, [hash, email]);

            if (!reset || reset.rowCount === 0) {
                return NextResponse.json({ error: 'Password reset unsuccessful :-(' }, { status: 400 })
            } else {
                return NextResponse.json({ statusText: 'Password reset successful!' }, { status: 200 })
            }
        };
        default: {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
    }
}