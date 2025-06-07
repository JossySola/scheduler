"use server"
import "server-only"
import { auth, signOut } from "@/auth";
import pool from "@/app/lib/mocks/db";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function DeleteAccountAction (state: { message: string }, formData: FormData) {
    const session = await auth();
    const password = formData.get("password")?.toString();
    const email = session?.user?.email;

    if (!session?.user || !email || !password) {
        return {
            message: "Data is missing"
        };
    }

    const providers = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/user/providers`, {
        method: 'GET',
        headers: {
            "user_email": email
        }
    })
    const providersResponse = await providers.json();
    providersResponse.data && providersResponse.data.map(async (row: { provider: string }) => {
        if (row.provider === "Google") {
            await DisconnectGoogleAction();
        }
        if (row.provider === "Facebook") {
            await DisconnectFacebookAction();
        }
    })

    const verify = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/verify/password`, {
        method: "POST",
        body: JSON.stringify({
            username: email,
            password
        })
    })

    if (!verify.ok || verify.status !== 200) {
        return {
            message: "Invalid password"
        }
    }

    const request = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/user/delete`, {
        method: "GET",
        headers: {
            "user_email": email
        }
    })

    if (request.ok) {
        return await signOut();
    }
    return {
        message: ""
    }
}

export async function DisconnectGoogleAction () {
    const session = await auth();
    const token = session?.googleAccessToken;
    const email = session?.user?.email;
    
    if (!token || !email) {
        return null;
    }

    const request = await fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        }
    })
    
    if (request.status === 200) {
        await sql`
            DELETE FROM scheduler_users_providers
            WHERE email = ${email} AND provider = 'Google';
        `;

        const providers = await sql`
           SELECT * FROM scheduler_users_providers
           WHERE email = ${email}; 
        `;

        if (providers.rowCount === 0) {
            return await signOut();
        }
    }

    return request.status;
}

export async function DisconnectFacebookAction () {
    const session = await auth();
    const token = session?.facebookAccessToken;
    const sub = session?.user?.facebookSub;
    const email = session?.user?.email;

    if (!token || !email || !sub) {
        return null;
    }

    const request = await fetch(`https://graph.facebook.com/${sub}/permissions`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (request.status === 200) {
        await sql`
            DELETE FROM scheduler_users_providers
            WHERE email = ${email} AND provider = 'Facebook';
        `;

        const providers = await sql`
            SELECT * FROM scheduler_users_providers
            WHERE email = ${email}; 
         `;
 
         if (providers.rowCount === 0) {
            return await signOut();
        }
    }

    return request.status;
}
export async function DeleteTableAction (previousState: { message: string },formData: FormData) {
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";
    const table_id = formData.get("item_id")?.toString();
    const session = await auth();

    if (!table_id) {
        return {
            message: locale === "es" ? "" : "",
        };
    }

    if (!session?.user || !session?.user?.id) {
        return {
            message: locale === "es" ? "" : "",
        }
    }
    const deletion = await sql`
        DELETE FROM scheduler_users_tables WHERE id = ${table_id} AND user_id = ${session.user.id};
    `;
    if (deletion.rowCount === 0) {
        return {
            message: locale === "es" ? "Hubo un problema al tratar de eliminar la tabla, por favor inténtalo más tarde." : "We failed to delete your schedule, please try again later.",
        }
    }
    const update = await sql`
        UPDATE scheduler_users
        SET num_tables = GREATEST(num_tables - 1, 0)
        WHERE id = ${session.user.id};
    `;

    revalidatePath(`${process.env.NEXT_PUBLIC_ORIGIN}/${locale}/dashboard`);
    revalidatePath(`${process.env.NEXT_PUBLIC_ORIGIN}/${locale}/table/${table_id}`);
    redirect(`${process.env.NEXT_PUBLIC_ORIGIN}/${locale}/dashboard`);
    return {
        message: locale === "es" ? "" : "",
    }
}