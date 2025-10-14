"use server"
import "server-only";
import { sql } from "@vercel/postgres";
import pool from "@/app/lib/mocks/db";
import { signIn } from "@/auth";
import { headers } from "next/headers";

export async function verifyTokenAction (state: { message: string }, formData: FormData) {
    const token = formData.get('confirmation-token')?.toString();
    const name = formData.get('name')?.toString();
    const username = formData.get('username')?.toString();
    const birthday = formData.get('birthday')?.toString();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    const requestHeaders = await headers();
    const locale = requestHeaders.get("x-user-locale")?.toString() || "en";
    if (!token) {
        return {
            ok: false,
            message: locale === "es" ? 
                "Por favor ingresa el código enviado a tu correo electrónico" : 
                "Please type the code sent to your email in the field above"
        }
    }
    if (!name || !username || !birthday || !email || !password) {
        return {
            ok: false,
            message: locale === "es" ? 
            "Falta información" : 
            "Some data is missing"
        }
    }
    
    const confirm = await handleEmailConfirmation(token, email);
    if (confirm.ok === false) {
        return {
            ok: false,
            message: confirm.message
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
    if (!signup.ok || signup.status !== 200) {
        return {
            ok: false,
            message: locale === "es" ? 
            "Registro fallido" : 
            "Failed to register record"
        }
    }
    await handleLogin(username, password, locale);
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
    if (!token || !email) {
        return {
            ok: false,
            message: lang === "es" ? 
            "Falta información" : 
            "Data missing"
        }
    }
    const confirming = await sql`
        SELECT token 
        FROM scheduler_email_confirmation_tokens
        WHERE email = ${email} 
            AND token = ${token} 
            AND expires_at > NOW();
    `;
    if (!confirming || confirming.rowCount === 0) {
        return {
            ok: false,
            message: lang === "es" ? 
            "El código es erróneo o ha expirado" : 
            "The code is incorrect or has expired"
        }
    }
    const deleting = await sql`
        DELETE FROM scheduler_email_confirmation_tokens
        WHERE email = ${email} AND token = ${token};
    `;
    if (deleting.rowCount === 0) {
        return {
            ok: false,
            message: lang === "es" ? 
            "Error Interno" : 
            "Failed to consume"
        }
    }
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
    if (!username || !password) {
        return {
            ok: false,
            message: lang === "es" ? 
            "Fallo en inicio de sesión" : 
            "Failed to login"
        }
    }
    const signing = await signIn('credentials', {
        redirect: true,
        redirectTo: `${process.env.NEXT_PUBLIC_ORIGIN}/${locale}/dashboard`,
        username,
        password,
    })
}