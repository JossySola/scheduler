import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/mocks/db";
import { z } from "zod";
import { Argon2id } from "oslo/password";

export async function POST(request: NextRequest) {
    const payload = await request.json();
    
    switch(payload.action) {
        case 'verify-token': {
            if (!payload.verification_token || !payload.email) {
                return NextResponse.json({
                    status: 400,
                    statusText: 'The confirmation token must be provided'
                })
            }
        
            if (payload.verification_token.length < 6 || payload.verification_token.length > 6) {
                return NextResponse.json({
                    status: 406,
                    statusText: 'The token must be 6 characters in length'
                })
            }
        
            const validate = await pool.query(`
                UPDATE scheduler_email_confirmation_tokens
                    SET used_at = NOW()
                    WHERE token = $1 AND email = $2;
            `, [payload.verification_token, payload.email]);
        
            if (validate.rowCount === 0) {
                return NextResponse.json({
                    status: 404,
                    statusText: 'Invalid token'
                })
            }
            return NextResponse.json({
                status: 200,
                statusText: 'Token confirmed!'
            })
        };
        case 'password-reset': {
            if (!payload.password) {
                return NextResponse.json({
                    status: 400,
                    statusText: 'Empty password'
                })
            }
            if (payload.password.length < 8) {
                return NextResponse.json({
                    status: 400,
                    statusText: 'Password must have at least 8 characters'
                })
            }

            const validate = z.string().min(1).email().safeParse(payload.email);
            if (!validate) {
                return NextResponse.json({
                    status: 400,
                    statusText: 'Invalid e-mail'
                })
            }

            const argon = new Argon2id();
            const hash = await argon.hash(payload.password)

            const reset = await pool.query(`
                UPDATE scheduler_users
                    SET password = $1
                    WHERE email = $2;
            `, [hash, payload.email]);

            if (!reset || reset.rowCount === 0) {
                return NextResponse.json({
                    status: 400,
                    statusText: 'Password reset unsuccessful :-('
                })
            } else {
                return NextResponse.json({
                    status: 200,
                    statusText: 'Password reset successful!'
                })
            }
        };
        default: {
            return NextResponse.json({
                status: 403,
                statusText: 'Forbidden'
            })
        }
    }
}