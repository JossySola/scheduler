"use server"
import "server-only";
import { auth, signIn } from "@/auth";
import pool from "@/app/lib/mocks/db";
import { randomUUID } from "crypto";
import sgMail from "@sendgrid/mail";

export async function LogInAction (prevState: { message: string }, formData: FormData) {
    console.log("[LogInAction] Starting...")
    console.log("[LogInAction] formData:", formData)

    const username = formData.get("username");
    const password = formData.get("password");

    if (!formData || !username || !password) {
        console.log("[LogInAction] There is data missing...")
        return {
            message: "Data is missing"
        }
    }
    
    try {
        console.log("[LogInAction] Entering try block...")
        console.log("[LogInAction] Logging in...")
        console.log("[LogInAction] Exiting...")
        await signIn("credentials", {
            username,
            password,
            redirect: true,
            redirectTo: "/dashboard"
        })
        return {
            message: "Logged in"
        }
    } catch (error) {
        console.log("[LogInAction] Entering catch block...")
        console.log("[LogInAction] Error:", error)
        console.log("[LogInAction] Exiting...")
        if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
            return {
                message: "Invalid credentials"
            }
        }
        throw error;
    }
}

export async function SendResetEmailAction () {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
        return {
            ok: false,
            message: "Session missing"
        }
    };

    const query = await pool.query(`
       SELECT EXISTS (
        SELECT 1 FROM scheduler_users WHERE email = $1
       );
    `, [email]);
    const userExists = query.rows[0].exists;

    if (!userExists) {
        return {
            ok: false,
            message: "User not found"
        }
    };

    const token = randomUUID();
    const url = new URL(`${process.env.NEXT_PUBLIC_ORIGIN}/reset/q`);
    url.searchParams.append('email', email);
    url.searchParams.append('token', token);

    const message = {
        to: `${email}`,
        from: 'no-reply@jossysola.com',
        subject: 'Scheduler: Reset Password Request',
        html: `
        <html>
            <body>
                <a href="${url.toString()}">Reset Password</a>
            </body>
        </html>
        `,
    }

    try {
       process.env.SENDGRID_API_KEY && sgMail.setApiKey(process.env.SENDGRID_API_KEY); 
        const query = await pool.query(`
           INSERT INTO scheduler_password_resets
           (email, token, expires_at) 
           VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '3 minutes');
        `, [email, token]);
        if (query.rowCount === 0) {
            throw new Error("Failed insertion");
        }

        const sending = await sgMail.send(message);
        if (sending[0].statusCode !== 202) {
            throw new Error("Failed sending email");
        }
        return {
            ok: true,
            message: "Email sent!"
        }
    } catch (e) {
        return {
            ok: false,
            message: e.message,
        }
    }
}