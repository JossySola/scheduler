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
    console.error("[validateAction] Checking existence of data...")
    if (!name || !username || !birthday || !email || !password || !confirmation) {
        console.error("[validateAction] Some data is missing...")
        console.error("[validateAction] Exiting...")
        return {
            message: "Some fields are empty",
            passes: false
        };
    }
    console.error("[validateAction] Checking password confirmation...")
    if (password !== confirmation) {
        console.error("[validateAction] Password confirmation failed...")
        console.error("[validateAction] Exiting...")
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
    console.error("[validateAction] Connecting to /api/verify/user...")
    const request = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/verify/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username,
            email,
        }),
    });

    const response = await request.json();
    console.error("[validateAction] Endpoint result:", response)
    const userExists = request.status === 200 ? {
              error: {
                  issues: [{ message: response.statusText }],
              },
          }
        : { success: true };
        console.error("[validateAction] User exists:", userExists)
    const errors = [userExists, validName, validUsername, validBirthday, validEmail, validPassword]
        .filter((result) => !result.success);

    console.error("[validateAction] Current errors:", errors)
    const exposedPassword = await isPasswordPwned(password.toString());
    console.error("[validateAction] Exposed password check result:", exposedPassword)
    if (typeof exposedPassword !== 'number') {
        console.error("[validateAction] Exposed password check result is not a number:", typeof exposedPassword)
        console.error("[validateAction] Exiting...")
        return {
            message: exposedPassword.message,
            passes: false,
            descriptive: [...errors, { error: { issues: [{ message: exposedPassword.message }] } }],
        }
    }
    
    if (exposedPassword !== 0) {
        console.error("[validateAction] Password is exposed")
        console.error("[validateAction] Exiting...")
        return {
            message: 'After a password check, the password provided has been exposed in a data breach. For security reason, please choose a stronger password.',
            passes: false,
            descriptive: [...errors, { error: { issues: [{ message: 'After a password check, the password provided has been exposed in a data breach. For security reason, please choose a stronger password.' }] } }],
        }
    }
    console.error("[validateAction] Password is not exposed")
    
    console.error("[validateAction] Starting to send email confirmation...")
    const send = await sendEmailConfirmation(email.toString(), name.toString());
    console.error("[validateAction] Email sender result:", send)
    console.error("[validateAction] Exiting...")
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
    console.error("[confirmEmailAction] Starting...")
    console.error("[confirmEmailAction] Checking if token exists...")
    if (!token) {
        console.error("[confirmEmailAction] Token doesn't exist, exiting...")
        return {
            ok: false,
            message: "Please type the code sent to your email in the field above"
        }
    }
    console.error("[confirmEmailAction] Checking if other data exist...")
    if (!name || !username || !birthday || !email || !password) {
        console.error("[confirmEmailAction] Some data is missing, exiting...")
        return {
            ok: false,
            message: "Some data is missing"
        }
    }
    console.error("[confirmEmailAction] Entering handleEmailConfirmation...")
    const confirm = await handleEmailConfirmation(token, email);
    console.error("[confirmEmailAction] Function result:", confirm)
    if (!confirm.ok) {
        return {
            ok: false,
            message: confirm.message
        }
    }
    console.error("[confirmEmailAction] Connecting to /api/signup...")
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
    console.error("[confirmEmailAction] Endpoint result:", signup)
    if (signup.status !== 200 || !signup.ok) {
        console.error("[confirmEmailAction] Endpoint result failed:", signup)
        return {
            ok: false,
            message: "Failed to register record"
        }
    }
    console.error("[confirmEmailAction] Starting handleLogin...")
    const logging = await handleLogin(username, password);
    console.error("[confirmEmailAction] Result while logging:", logging)
    console.error("[confirmEmailAction] Exiting...")
    return {
        ok: true,
        message: "Signup process successfuly complete"
    }
}

async function handleEmailConfirmation (token: string, email: string) {
    console.error("[handleEmailConfirmation] Starting...")
    console.error("[handleEmailConfirmation] Checking if data exist...")
    if (!token || !email) {
        console.error("[handleEmailConfirmation] Some data don't exist")
        console.error("[handleEmailConfirmation] Exiting...")
        return {
            ok: false,
            message: 'Data missing'
        }
    }
    console.error("[handleEmailConfirmation] Starting query...")
    console.error("[handleEmailConfirmation] SELECT token WHERE token AND email")
    const confirming = await pool.query(`
        SELECT token 
        FROM scheduler_email_confirmation_tokens
        WHERE email = $1 
            AND token = $2 
            AND expires_at > NOW();
    `, [email, token]);
    console.error("[handleEmailConfirmation] Query result:", confirming)
    if (!confirming || confirming.rowCount === 0) {
        console.error("[handleEmailConfirmation] Query failed")
        console.error("[handleEmailConfirmation] Exiting...")
        return {
            ok: false,
            message: 'The code is incorrect or has expired'
        }
    }
    console.error("[handleEmailConfirmation] Starting query...")
    console.error("[handleEmailConfirmation] DELETE row")
    const deleting = await pool.query(`
        DELETE FROM scheduler_email_confirmation_tokens
        WHERE email = $1 AND token = $2;
    `, [email, token]);
    console.error("[handleEmailConfirmation] Query result:", deleting)
    if (deleting.rowCount === 0) {
        console.error("[handleEmailConfirmation] Query failed")
        console.error("[handleEmailConfirmation] Exiting...")
        return {
            ok: false,
            message: "Failed to consume"
        }
    }
    console.error("[handleEmailConfirmation] Exiting...")
    return {
        ok: true,
        message: 'Email confirmed!'
    }
}

async function handleLogin (username: string, password: string) {
    console.error("[handleLogin] Starting...")
    console.error("[handleLogin] Checking if necessary data exist...")
    if (!username || !password) {
        console.error("[handleLogin] Some data is missing, exiting...")
        return {
            ok: false,
            message: "Failed to login"
        }
    }
    console.error("[handleLogin] Signing in...")
    const signing = await signIn('credentials', {
        redirect: true,
        redirectTo: '/dashboard',
        username,
        password,
    })
    console.error("[handleLogin] Signin result:", signing)
}