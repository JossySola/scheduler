"use server"
import "server-only"
import { auth, signOut } from "@/auth";
import pool from "@/app/lib/mocks/db";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { decryptKmsDataKey, verifyPasswordAction } from "@/app/lib/utils";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function DeleteAccount_NoPassword () {
    const session = await auth();
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";
    try {
        const providers = await sql`
        SELECT provider FROM scheduler_users_providers
        WHERE email = ${session.user.email};
        `.then(response => response.rowCount !== 0 ? response.rows : null);

        if (providers) {
            providers.forEach(async (element) => {
                if (element.provider === 'google') {
                    await DisconnectGoogleAction();
                }
                if (element.provider === 'facebook') {
                    await DisconnectFacebookAction();
                }
            })
        }
        await signOut();
    } catch (error) {
        if (isRedirectError(error)) {
            redirect(`/${locale}/signup`);
        }
        return {
            message: locale === "es" ? "Hubo un problema para completar el proceso, por favor contáctanos." : "There was an issue while completing the process, please contact us."
        }
    }
}
export async function DeleteAccountAction (state: { message: string }, formData: FormData) {
    const session = await auth();
    const password = formData.get("password")?.toString();
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";
    
    if (session && session.user && session.user.id && password) {
        // Get password KMS key
        const password_key = await sql`
        SELECT user_password_key FROM scheduler_users
        WHERE id = ${session.user.id};
        `.then(response => response.rowCount !== 0 ? response.rows[0].user_password_key : null)
        .catch(e => console.error(e));
        // Decrypt KMS key
        const decrypted_key = password_key ? await decryptKmsDataKey(password_key) : null;
        // Get and decrypt BYTEA password
        const decrypted_password = decrypted_key 
        ? await sql`SELECT pgp_sym_decrypt_bytea(password, ${decrypted_key}) AS decrypted_password FROM scheduler_users WHERE id = ${session.user.id};`.then(response => response.rowCount !== 0 ? response.rows[0].decrypted_password : null)
        : null;
        // Verify hashed password
        const verification = decrypted_password 
        ? await verifyPasswordAction(decrypted_password.toString(), password)
        : null;
        if (verification === false) {
            // If verification fails
            return {
                message: locale === "es" ? "Contraseña incorrecta" : "Invalid password"
            }
        } else if (verification === null) {
            // If either prior variables returned null
            return {
                message: locale === "es" ? "Hubo un error al iniciar el proceso" : "An error has occurred while starting the process"
            }
        }

        // The password is correct, proceed:
        const providers = await sql`
            SELECT provider FROM scheduler_users_providers
            WHERE email = ${session.user.email};
        `.then(response => response.rowCount !== 0 ? response.rows : null);

        if (providers) {
            providers.forEach(async (element) => {
                if (element.provider === 'google') {
                    await DisconnectGoogleAction();
                }
                if (element.provider === 'facebook') {
                    await DisconnectFacebookAction();
                }
            })
        }

        try {
            await sql`DELETE FROM scheduler_password_resets WHERE email = ${session.user.email};`
            await sql`DELETE FROM scheduler_users_tables WHERE user_id = ${session.user.id};`
            await sql`DELETE FROM scheduler_users_providers WHERE email = ${session.user.email};`
            await sql`DELETE FROM scheduler_login_attempts WHERE email = ${session.user.email};`
            await sql`DELETE FROM scheduler_email_confirmation_tokens WHERE email = ${session.user.email};`
            await sql`UPDATE scheduler_users
                SET
                    name = '[deleted user]',
                    username = CONCAT('deleted_', id),
                    email = CONCAT(id, '@deleted.com'),
                    birthday = NULL,
                    password = NULL,
                    user_password_key = CONCAT('deleted_', id),
                    deleted_at = NOW(),
                    user_image = NULL
                WHERE id = ${session.user.id};
            `;
            await signOut();
        } catch (error) {
            if (isRedirectError(error)) {
                redirect(`/${locale}/signup`);
            }
            return {
                message: locale === "es" ? "Hubo un problema para completar el proceso, por favor contáctanos." : "There was an issue while completing the process, please contact us."
            }
        }
    }
    return {
        message: locale === "es" ? "Parece que el sistema no identifica tu sesión 😨, por favor cierra e inicia sesión." : "Looks like the system is not recognizing your session 😨, please sign out and in again."
    }
}

export async function DisconnectGoogleAction () {
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";
    const session = await auth();
    const token = session.googleAccessToken;
    
    const request = await fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        }
    })

    if (request.ok && request.status === 200) {
        const user_record = await sql`
        SELECT scheduler_users.password, scheduler_users_providers.provider
        FROM scheduler_users
        LEFT JOIN scheduler_users_providers
        ON scheduler_users.email = scheduler_users_providers.email
        WHERE scheduler_users.email = ${session.user.email};`
        .then(response => response.rowCount !== 0 ? response.rows[0] : null);

        if (user_record && user_record.password === null && user_record.provider === null) {
            await sql`DELETE FROM scheduler_users_providers WHERE email = ${session.user.email};`;
            await sql`DELETE FROM scheduler_users_tables WHERE email = ${session.user.email};`;
            await sql`DELETE FROM scheduler_password_resets WHERE email = ${session.user.email};`;
            await sql`DELETE FROM scheduler_login_attempts WHERE email = ${session.user.email};`;
            await sql`DELETE FROM scheduler_email_confirmation_tokens WHERE email = ${session.user.email};`;
            await sql`UPDATE scheduler_users
                SET
                    name = '[deleted user]',
                    username = CONCAT('deleted_', id),
                    email = CONCAT(id, '@deleted.com'),
                    birthday = NULL,
                    password = NULL,
                    user_password_key = CONCAT('deleted_', id),
                    deleted_at = NOW(),
                    user_image = NULL
                WHERE id = ${session.user.id} AND email = ${session.user.email};
            `;
            await signOut();
        }
        const image: string | null = await sql`SELECT user_image FROM scheduler_users WHERE email = ${session.user.email};`
        .then(response => response.rowCount !== 0 ? response.rows[0].user_image : null);
        if (image) {
            if (image.includes('google')) {
                await sql`
                UPDATE scheduler_users
                SET user_image = NULL
                WHERE email = ${session.user.email};
                `;
                session.user.image = "";
            }
        }
        await sql`DELETE FROM scheduler_users_providers WHERE email = ${session.user.email} AND provider = 'google';`;
        await signOut();
    }
    return {
        message: locale === "es" ? "La petición no tuvo éxito con el proveedor." : "The process returned unsuccessful by the provider."
    }
}
export async function DisconnectFacebookAction () {
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";
    const session = await auth();
    const token = session.facebookAccessToken;
    const key = await sql`
    SELECT account_id_key
    FROM scheduler_users_providers
    WHERE provider = 'facebook' AND email = ${session.user.email};`
    .then(response => response.rowCount !== 0 ? response.rows[0].account_id_key : null);
    
    if (key) {
        const decrypted_key = await decryptKmsDataKey(key);
        const id = await sql`
        SELECT pgp_sym_decrypt_bytea(account_id, ${decrypted_key}) AS decrypted_id
        FROM scheduler_users_providers
        WHERE provider = 'facebook' AND email = ${session.user.email};`
        .then(response => response.rowCount !== 0 ? response.rows[0].decrypted_id: null);
        
        const request = await fetch(`https://graph.facebook.com/${id}/permissions`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (request.ok && request.status === 200) {
            const user_record = await sql`
            SELECT scheduler_users.password, scheduler_users_providers.provider
            FROM scheduler_users
            LEFT JOIN scheduler_users_providers
            ON scheduler_users.email = scheduler_users_providers.email
            WHERE scheduler_users.email = ${session.user.email};`
            .then(response => response.rowCount !== 0 ? response.rows[0] : null);

            if (user_record && user_record.password === null && user_record.provider === null) {
                await sql`DELETE FROM scheduler_users_providers WHERE email = ${session.user.email};`;
                await sql`DELETE FROM scheduler_users_tables WHERE email = ${session.user.email};`;
                await sql`DELETE FROM scheduler_password_resets WHERE email = ${session.user.email};`;
                await sql`DELETE FROM scheduler_login_attempts WHERE email = ${session.user.email};`;
                await sql`DELETE FROM scheduler_email_confirmation_tokens WHERE email = ${session.user.email};`;
                await sql`UPDATE scheduler_users
                    SET
                        name = '[deleted user]',
                        username = CONCAT('deleted_', id),
                        email = CONCAT(id, '@deleted.com'),
                        birthday = NULL,
                        password = NULL,
                        user_password_key = CONCAT('deleted_', id),
                        deleted_at = NOW(),
                        user_image = NULL
                    WHERE id = ${session.user.id} AND email = ${session.user.email};
                `;
                await signOut();
            }
            const image: string | null = await sql`SELECT user_image FROM scheduler_users WHERE email = ${session.user.email};`
            .then(response => response.rowCount !== 0 ? response.rows[0].user_image : null);
            if (image) {
                if (image.includes('fbsbx')) {
                    await sql`
                    UPDATE scheduler_users
                    SET user_image = NULL
                    WHERE email = ${session.user.email};
                    `;
                    session.user.image = "";
                }
            }
            await sql`DELETE FROM scheduler_users_providers WHERE email = ${session.user.email} AND provider = 'facebook';`;
            await signOut();
        }
        return {
            message: locale === "es" ? "La petición no tuvo éxito con el proveedor." : "The process returned unsuccessful by the provider."
        }
    }
    return {
        message: locale === "es" ? "Hubo un error inesperado, inténtalo nuevamente y/o contáctanos para reportar el problema." : "An unexpected error has occured, please try again and/or contact us to report the issue."
    }
}
export async function DeleteTableAction (previousState: { message: string }, formData: FormData) {
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";
    const table_id = formData.get("item_id")?.toString();
    const session = await auth();

    if (session.user && session.user.id && table_id) { 
        const deletion = await sql`
        DELETE FROM scheduler_users_tables 
        WHERE id = ${table_id} 
        AND user_id = ${session.user.id};
        `;
        if (deletion.rowCount === 0) {
            return {
                message: locale === "es" ? "Hubo un problema al tratar de eliminar la tabla, por favor inténtalo más tarde." : "We failed to delete your schedule, please try again later.",
            }
        }
        await sql`
        UPDATE scheduler_users
        SET num_tables = GREATEST(num_tables - 1, 0)
        WHERE id = ${session.user.id};
        `;
        revalidatePath(`${process.env.NEXTAUTH_URL}/${locale}/dashboard`);
        revalidatePath(`${process.env.NEXTAUTH_URL}/${locale}/table/${table_id}`);
        redirect(`${process.env.NEXTAUTH_URL}/${locale}/dashboard`);
        return {
            message: "Deleted",
        }
    }
    return {
        message: "Unauthenticated",
    }
}