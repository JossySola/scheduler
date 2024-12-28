'use server'
import "server-only";
import crypto from "crypto";
import pool from "./mocks/db";
import { Argon2id } from "oslo/password";
import { auth, signOut } from "@/auth";

export async function getUserFromDb (username: string, email: string, password: string) {
    try {
        const user = await pool.query(`
            SELECT * FROM scheduler_users 
                WHERE username = $1 OR email = $2;
        `, [username, email]);
        if (user.rows.length === 0) {
            return {
                message: "User not found.",
                ok: false
            };
        }
        const userRecord = user.rows[0];
        const argon2id = new Argon2id();

        if (await argon2id.verify(userRecord.password, password)) {
            return {
                id: userRecord.id,
                name: userRecord.name,
                username: userRecord.username,
                email: userRecord.email,
                birthday: userRecord.birthday,
                created_at: userRecord.created_at,
                role: userRecord.role,
                ok: true
            };
        } else {
            return {
                message: "Invalid credentials.",
                ok: false
            };
        }
    } catch (error) {
        return {
            message: "Unknown error from server.",
            ok: false
        }
    }
}

export async function isPasswordPwned (password: string) {
    try {
        // API requires password to be hashed with SHA1
        const hashed = crypto.createHash('sha1').update(password).digest('hex');
        // "range" endpoint requires only the first 5 characters of the hashed password
        const range = hashed.slice(0,5);
        // Slice gives the remaining hashed password after the string index 5
        const suffixToCheck = hashed.slice(5).toUpperCase();
        const response = await fetch(`https://api.pwnedpasswords.com/range/${range}`);
        // The API returns a plain text response, not a JSON
        const text = await response.text();
        // For each \n break, convert the plain text into an Array
        const lines = text.split('\n');

        for (const line of lines) {
            // The format of each line is divided by a ":", the left part is the suffix and the right part is the count
            const [hashSuffix, count] = line.split(':');
            // If the rest of the hashed password is found on the exposed list
            if (hashSuffix === suffixToCheck) {
                // return the count part as a number
                return parseInt(count, 10);
            }
        }
        // If the remaining part of the hashed password is not found on the list, return 0
        return 0;
    } catch (error) {
        return {
            message: "Unknown error from exposed password checking.",
            ok: false
        };
    }
}

export async function getSession () {
    const session = await auth();
    return session;
}

export async function handleSignOut() {
    await signOut({
        redirect: true,
        redirectTo: "/login"
    });
}