"use server"
import "server-only";
import { isPasswordPwned } from "@/app/lib/utils";
import { auth, signOut } from "@/auth";
import { Argon2id } from "oslo/password";
import pool from "@/app/lib/mocks/db";

export async function passwordResetAction(prevState: { message: string }, formData: FormData) {
    const password = formData.get("password")?.toString();
    const confirmation = formData.get("confirm-password")?.toString();
    const token = formData.get("token")?.toString();
    const session = await auth();
    const email = session?.user?.email;

    if (!password || !confirmation) {
        return {
            message: "Please fill out both input fields."
        }
    }

    if (password.length < 8) {
        return {
            message: "Your password must have at least 8 characters."
        }
    }

    if (password !== confirmation || !token) {
        return {
            message: "Password confirmation failed."
        }
    }

    const argon = new Argon2id();
    const oldPassword = await pool.query(`
       SELECT password FROM scheduler_users
       WHERE email = $1; 
    `, [email]);
    if (oldPassword.rowCount === 0) {
        return {
            message: "User not found"
        }
    }
    const comparison = await argon.verify(oldPassword.rows[0].password, password);
    if (comparison) {
        return {
            message: "New password cannot be the same as the old password"
        }
    }

    const exposed = await isPasswordPwned(password);
    if (typeof exposed === 'number' && exposed > 0) {
        return {
            message: "After a password checkup, it appears this password has been exposed in a data breach in the past. Please use a stronger password."
        }
    }
    
    const hash: string = await argon.hash(password);

    const query = await pool.query(`
       UPDATE scheduler_users
       SET password = $1
       WHERE email = $2; 
    `, [hash, email]);
    if (query.rowCount === 0) {
        return {
            message: "Password reset failed"
        }
    }

    const invalidate = await pool.query(`
        UPDATE scheduler_password_resets
        SET used_at = NOW()
        WHERE email = $1 AND token = $2
        RETURNING used_at;
    `, [email, token]);

    if (invalidate.rowCount === 0) {
        return {
            message: "Failed to invalidate token"
        }
    }

    await signOut({
        redirect: true,
        redirectTo: "/login"
    });

    return {
        message: "Reset successful"
    }
}