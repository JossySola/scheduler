'use server'
import pool from "@/app/lib/mocks/db";
import { isPasswordPwned, sendEmailConfirmation } from "@/app/lib/utils-server";
import { signIn } from "@/auth";
import { z } from "zod";

export async function validateAction (state: { message: string }, formData: FormData) {
    const name = formData.get("name");
    const username = formData.get("username");
    const birthday = formData.get("birthday");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmation = formData.get("confirmpwd");

    if (!name || !username || !birthday || !email || !password || !confirmation) {
        return {
            message: "Some fields are empty",
            passes: false
        };
    }

    if (password !== confirmation) {
        return {
            message: "Password confirmation is incorrect",
            passes: false
        };
    }

    const validName = z.string().min(3, { message: "Name too short" }).safeParse(name);
    const validUsername = z.string().min(3, { message: "Username too short" }).safeParse(username);
    const validBirthday = z.preprocess(
        (value) => (typeof value === "string" ? new Date(value) : value),
        z.date({ message: "Invalid date" })
    ).safeParse(birthday);
    const validEmail = z.string().email({ message: "Invalid email address" }).safeParse(email);
    const validPassword = z.string().min(8, { message: "Password must have at least 8 characters" }).safeParse(password);

    const request = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/verify/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username,
            email,
        }),
    });

    const response = await request.json();
    const userExists = response.status === 200
        ? {
              error: {
                  issues: [{ message: response.statusText }],
              },
          }
        : { success: true };

    const errors = [userExists, validName, validUsername, validBirthday, validEmail, validPassword]
        .filter((result) => !result.success);

    const exposedPassword = await isPasswordPwned(password.toString());
    
    if (exposedPassword !== 0) {
        return {
            message: 'After a password check, the password provided has been exposed in a data breach. For security reason, please choose a stronger password.',
            passes: false,
            descriptive: [...errors, { error: { issues: [{ message: 'After a password check, the password provided has been exposed in a data breach. For security reason, please choose a stronger password.' }] } }],
        }
    }
    if (typeof exposedPassword !== 'number') {
        return {
            message: exposedPassword.message,
            passes: false,
            descriptive: [...errors, { error: { issues: [{ message: exposedPassword.message }] } }],
        }
    }
    
    if (errors.length === 0) {
        const request = await sendEmailConfirmation(email.toString(), name.toString());
        if (!request.ok) {
            return {
                message: request.message,
                passes: false,
                descriptive: [...errors, { error: { issues: [{ message: request.message }] } }]
            }
        }
    }
    return {
        message: errors.length ? "Validation failed" : "Validation successful",
        passes: errors.length ? false : true,
        descriptive: errors,
    };
}

export async function confirmEmailAction (state: { message: string }, formData: FormData) {
    const token = formData.get('confirmation-token')?.toString();
    const name = formData.get('name')?.toString();
    const username = formData.get('username')?.toString();
    const birthday = formData.get('birthday')?.toString();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    
    const confirm = await handleEmailConfirmation(token, email);
    if (!confirm.ok) {
        return {
            ok: false,
            message: "Invalid or expired code"
        }
    }

    const signup = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/signup`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            username,
            email,
            birthday,
            password,
        })
    })
    if (signup.status !== 200 || !signup.ok) {
        return {
            ok: false,
            message: "Failed to register record"
        }
    }

    await handleLogin(username, password);

    return {
        ok: true,
        message: "Signup process successfuly complete"
    }
}


async function handleEmailConfirmation (token: string, email: string) {
    if (!token || !email) {
        return {
            ok: false,
            message: 'Data missing'
        }
    }

    const confirming = await pool.query(`
        SELECT token 
        FROM email_confirmation_tokens
        WHERE email = $1 
            AND token = $2 
            AND expires_at > NOW();
    `, [email, token]);

    if (!confirming || confirming.rowCount === 0) {
        return {
            ok: false,
            message: 'The code is incorrect or has expired'
        }
    }

    await pool.query(`
        DELETE FROM email_confirmation_tokens
        WHERE email = $1 AND token = $2;
    `, [email, token]);

    return {
        ok: true,
        message: 'Email confirmed!'
    }
}
async function handleLogin (username: string, password: string) {
    if (!username || !password) {
        return {
            ok: false,
            message: "Failed to login"
        }
    }
    await signIn('credentials', {
        redirect: true,
        redirectTo: '/dashboard',
        username,
        password,
    })
}