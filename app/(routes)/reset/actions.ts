"use server"
import "server-only";
import { isPasswordPwned } from "@/app/lib/utils";

export async function handleTokenConfirmation(token: string | undefined, email: string | undefined) {
    console.error("[handleTokenConfirmation] Starting...")
    console.error("[handleTokenConfirmation] Checking necessary data...")
    if (!token || !email) {
        console.error("[handleTokenConfirmation] Data missing, exiting...")
        return {
            status: 400,
            statusText: 'You must provide the token'
        }
    }
    console.error("[handleTokenConfirmation] Fetching from /api/verify/reset...")
    const confirm = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/verify/reset`, {
        method: 'POST',
        body: JSON.stringify({
            action: 'verify-token',
            email,
            verification_token: token
        })
    })
    console.error("[handleTokenConfirmation] Fetch result:", confirm)
    console.error("[handleTokenConfirmation] Exiting...")
    return await confirm.json();
}

export async function handlePasswordReset(password: string | undefined, confirm: string | undefined, email: string | undefined) {
    console.log("[handlePasswordReset] Starting...")
    console.log("[handlePasswordReset] Checking necessary data...")
    if (!password || !confirm || !email) {
        console.log("[handlePasswordReset] Data missing, exiting...")
        return {
            status: 400,
            statusText: 'Please provide a password and the confirmation'
        }
    }

    if (password !== confirm) {
        console.log("[handlePasswordReset] Password confirmation failed between the two provided, exiting...")
        return {
            status: 400,
            statusText: 'Please, confirm the password correctly'
        }
    }

    if (password.length < 8) {
        console.log("[handlePasswordReset] Password is less than 8 characters, exiting...")
        return {
            status: 400,
            statusText: 'The password must have at least 8 characters'
        }
    }
    console.log("[handlePasswordReset] Calling isPasswordPwned...")
    const exposureCheck = await isPasswordPwned(password);
    console.log("[handlePasswordReset] Function result:", exposureCheck)

    if (exposureCheck !== 0) {
        console.log("[handlePasswordReset] Function result is a number greater than 0, exiting...")
        return {
            status: 400,
            statusText: 'Upon a password verification, unfortunately this password has been exposed in a data breach. For security reasons, please choose another password.'
        }
    }
    console.log("[handlePasswordReset] Fetching from /api/verify/reset...")
    const reset = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/verify/reset`, {
        method: 'POST',
        body: JSON.stringify({
            action: 'password-reset',
            password: password,
            email
        })
    })
    console.log("[handlePasswordReset] Fetch result:", reset)
    console.log("[handlePasswordReset] Exiting...")
    return await reset.json();
}