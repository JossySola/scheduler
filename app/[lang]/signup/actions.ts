'use server'
import "server-only";
import pool from "@/app/lib/mocks/db";
import { isPasswordPwned, sendEmailConfirmation } from "@/app/lib/utils";
import { signIn } from "@/auth";
import { z } from "zod";
import { headers } from "next/headers";

export async function validateAction (state: { message: string }, formData: FormData) {
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";

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
    const userExists = request.status === 200 ? {
              error: {
                  issues: [{ message: response.statusText }],
              },
          }
    : { success: true };
    const errors = [userExists, validName, validUsername, validBirthday, validEmail, validPassword]
    .filter((result) => !result.success);

    const exposedPassword = await isPasswordPwned(password.toString());
    if (typeof exposedPassword !== 'number') {
        return {
            message: exposedPassword.message,
            passes: false,
            descriptive: [...errors, { error: { issues: [{ message: exposedPassword.message }] } }],
        }
    }
    
    if (exposedPassword !== 0) {
        return {
            message: 'After a password check, the password provided has been exposed in a data breach. For security reason, please choose a stronger password.',
            passes: false,
            descriptive: [...errors, { error: { issues: [{ message: 'After a password check, the password provided has been exposed in a data breach. For security reason, please choose a stronger password.' }] } }],
        }
    }
    
    const existQuery = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/user/id`, {
        method: 'GET', 
        headers: {
            "user_email": email.toString()
        }
    })
    const doesExist = await existQuery.json();
    
    if (doesExist.error === 'User not found') {
        await sendEmailConfirmation(email.toString(), name.toString());
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

    const requestHeaders = await headers();
    const locale = requestHeaders.get("x-user-locale")?.toString() || "en";

    console.error("[confirmEmailAction] Starting...")
    console.error("[confirmEmailAction] Checking if token exists...")
    if (!token) {
        console.error("[confirmEmailAction] Token doesn't exist, exiting...")
        return {
            ok: false,
            message: locale === "es" ? 
                "Por favor ingresa el código enviado a tu correo electrónico" : 
                "Please type the code sent to your email in the field above"
        }
    }
    console.error("[confirmEmailAction] Checking if other data exist...")
    if (!name || !username || !birthday || !email || !password) {
        console.error("[confirmEmailAction] Some data is missing, exiting...")
        return {
            ok: false,
            message: locale === "es" ? 
            "Falta información" : 
            "Some data is missing"
        }
    }
    console.error("[confirmEmailAction] Entering handleEmailConfirmation...")
    const confirm = await handleEmailConfirmation(token, email);
    console.error("[confirmEmailAction] Function result:", confirm)
    if (confirm.ok === false) {
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
            message: locale === "es" ? 
            "Registro fallido" : 
            "Failed to register record"
        }
    }
    console.error("[confirmEmailAction] Starting handleLogin...")
    const logging = await handleLogin(username, password, locale);
    console.error("[confirmEmailAction] Result while logging:", logging)
    console.error("[confirmEmailAction] Exiting...")
    return {
        ok: true,
        message: locale === "es" ? 
        "Registro completado" : 
        "Signup process successfuly complete"
    }
}

async function handleEmailConfirmation (token: string, email: string) {
    const headerList = await headers();
    const lang = headerList.get("x-user-locale")?.toString() || "en";

    console.error("[handleEmailConfirmation] Starting...")
    console.error("[handleEmailConfirmation] Checking if data exist...")
    if (!token || !email) {
        console.error("[handleEmailConfirmation] Some data don't exist")
        console.error("[handleEmailConfirmation] Exiting...")
        return {
            ok: false,
            message: lang === "es" ? 
            "Falta información" : 
            "Data missing"
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
            message: lang === "es" ? 
            "El código es erróneo o ha expirado" : 
            "The code is incorrect or has expired"
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
            message: lang === "es" ? 
            "Error Interno" : 
            "Failed to consume"
        }
    }
    console.error("[handleEmailConfirmation] Exiting...")
    return {
        ok: true,
        message: lang === "es" ? 
        "¡Correo electrónico confirmado!" : 
        "Email confirmed!"
    }
}

async function handleLogin (username: string, password: string, locale: string) {
    const headerList = await headers();
    const lang = headerList.get("x-user-locale")?.toString() || "en";
    console.error("[handleLogin] Starting...")
    console.error("[handleLogin] Checking if necessary data exist...")
    if (!username || !password) {
        console.error("[handleLogin] Some data is missing, exiting...")
        return {
            ok: false,
            message: lang === "es" ? 
            "Fallo en inicio de sesión" : 
            "Failed to login"
        }
    }
    console.error("[handleLogin] Signing in...")
    const signing = await signIn('credentials', {
        redirect: true,
        redirectTo: `/${locale}/dashboard`,
        username,
        password,
    })
    console.error("[handleLogin] Signin result:", signing)
}