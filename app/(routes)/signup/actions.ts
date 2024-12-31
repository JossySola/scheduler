'use server'
import pool from "@/app/lib/mocks/db";
import { redirect } from "next/navigation";

export default async function handleConfirmation (state: { message: string }, formData: FormData) {
    const token = formData.get('confirmation-token');
    const email = formData.get('email');
    
    const query = await pool.query(`
        UPDATE scheduler_users
            SET verified = true
            WHERE verify_token = $1 AND email = $2;
    `, [token, email]);
    
    if (query.rowCount > 0) {
        await pool.query(`
        UPDATE scheduler_users
            SET verify_token = ''
            WHERE email = $1;
        `, [email]);
        redirect('/dashboard');
    } else {
        return {
            message: 'The code is invalid or has expired. (El código es incorrecto o ha expirado)'
        }
    }
}